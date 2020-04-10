import os
from http import HTTPStatus
from functools import wraps
from flask import request, jsonify
from project.modules.users.models import Users
from itsdangerous.url_safe import URLSafeSerializer


def is_admin(user_id: int) -> bool:
    user = Users.query.filter_by(id=user_id).first()
    return user.admin


def generate_token_from_data(data: dict, salt: str = "user_activation") -> str:
    secret_key = os.environ.get('SECRET_KEY')
    serializer = URLSafeSerializer(secret_key)
    token = serializer.dumps(data, salt=salt)
    return token


def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        auth_header = request.headers.get('Authorization')
        print(auth_header)
        if not auth_header:
            return jsonify(response_object), HTTPStatus.FORBIDDEN
        auth_token = auth_header.split(" ")[1]
        resp = Users.decode_auth_token(auth_token)
        if isinstance(resp, str):
            response_object['message'] = resp
            return jsonify(response_object), HTTPStatus.UNAUTHORIZED

        user = Users.query.filter_by(id=resp).first()
        if not user or not user.active:
            return jsonify(response_object), HTTPStatus.UNAUTHORIZED
        return f(user, *args, **kwargs)

    return decorated_function


def authenticate_restful(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return response_object, HTTPStatus.FORBIDDEN
        auth_token = auth_header.split(" ")[1]
        resp = Users.decode_auth_token(auth_token)
        if isinstance(resp, str):
            response_object['message'] = resp
            return response_object, HTTPStatus.UNAUTHORIZED
        user = Users.query.filter_by(id=resp).first()
        if not user or not user.active:
            return response_object, HTTPStatus.UNAUTHORIZED
        return f(user, *args, **kwargs)

    return decorated_function
