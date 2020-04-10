from project.modules.users import api as users_api
from project.modules.auth import api as auth_api
from project.modules.auth.registration import api as registration_api
from flask_restx import Api

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}
api = Api(title="User Management Example API",
          authorizations=authorizations,
          version="1.0")


def initiate_app(app, **kwargs):
    api.add_namespace(registration_api, path="/api/v1/registrations")
    api.add_namespace(users_api, path="/api/v1/users")
    api.add_namespace(auth_api, path="/api/v1/auth")
    api.init_app(app)
