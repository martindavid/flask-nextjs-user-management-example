from flask import Blueprint, request, jsonify
from http import HTTPStatus
from sqlalchemy import exc, or_
from project.extensions import bcrypt
from project.modules.utils import authenticate
from project.modules.users.models import Users
from flask_restx import Resource, Namespace, fields
from project.modules.utils import authenticate_restful

api = Namespace("Authentication",
                description="Authentication related operations")

login_model = api.model(
    'Login', {
        "email": fields.String(required=True,
                               description="User email for login"),
        "password": fields.String(required=True,
                                  description="Password for login")
    })


@api.route('/login')
class Login(Resource):
    @api.expect(login_model, validate=True)
    def post(self):
        post_data = api.payload
        response_object = {'status': 'fail', 'message': 'Invalid payload'}
        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        email = post_data.get('email')
        password = post_data.get('password')
        try:
            user = Users.query.filter_by(email=email).first()
            if user and bcrypt.check_password_hash(user.password, password):
                auth_token = user.encode_auth_token(user.id)
                if auth_token:
                    response_object = {
                        'status': 'success',
                        'message': 'Successfully logged in',
                        'auth_token': auth_token
                    }
                    return response_object, HTTPStatus.OK
            else:
                response_object['message'] = 'User does not exist'
                return response_object, HTTPStatus.NOT_FOUND
        except Exception as e:
            api.logger.error(e)
            response_object['message'] = 'Try again.'
            return response_object, HTTPStatus.INTERNAL_SERVER_ERROR


@api.route('/logout')
class Logout(Resource):
    @authenticate_restful
    @api.doc(security="apikey")
    def get(self, user):
        response_object = {
            'status': 'success',
            'message': 'Successfully logged out'
        }
        return response_object, HTTPStatus.OK
