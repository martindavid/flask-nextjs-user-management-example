import logging
from datetime import datetime, timedelta
from flask import Blueprint, current_app
from project.modules.users.models import Users
from project.modules.utils import generate_token_from_data
from http import HTTPStatus
from flask_restx import Resource, Namespace, fields
from flask_sqlalchemy import orm
from project.extensions import db

log = logging.getLogger(__name__)

api = Namespace("Registration", description="Registration related operations")

registration_model = api.model(
    'Registration', {
        "firstName":
        fields.String(required=True, description="New user first name"),
        "lastName":
        fields.String(required=True, description="New user last name"),
        "email":
        fields.String(required=True, description="New user email"),
        "password":
        fields.String(required=True, description="New user password")
    })


@api.route('')
class Registrations(Resource):
    @api.expect(registration_model, validate=True)
    @api.doc(
        responses={
            201: "New user successfully created",
            500: "There's an error while register a new user",
            400: "There's a missing payload for the request"
        })
    def post(self):
        post_data = api.payload
        response_object = {'status': 'fail', 'message': 'Invalid payload'}
        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        first_name = post_data.get('firstName')
        last_name = post_data.get('lastName')
        email = post_data.get('email')
        password = post_data.get('password')

        try:
            user = Users.query.filter_by(email=email).first()
            if not user:
                # add new user to db
                new_user = Users(first_name=first_name,
                                 last_name=last_name,
                                 email=email,
                                 password=password)
                db.session.add(new_user)
                db.session.commit()

                confirmation_token = self.generate_activation_token(
                    new_user.email)
                return response_object, HTTPStatus.CREATED
            else:
                response_object['message'] = 'Sorry. That user already exists.'
                return response_object, HTTPStatus.BAD_REQUEST
        except Exception as e:
            db.session.rollback()
            api.logger.error(e)
            response_object = {"message": "Successfully"}
            return response_object, HTTPStatus.CREATED

    def generate_activation_token(self, email: str) -> str:
        token_max_expiration = current_app.config[
            'ACTIVATION_TOKEN_MAX_EXPIRATION']
        token_expiration = datetime.now() + timedelta(
            hours=float(token_max_expiration))
        token_data = {
            "email": email,
            "expired": token_expiration.strftime('%d/%m/%Y %H:%M:%S')
        }
        confirmation_token = generate_token_from_data(token_data)
        return confirmation_token
