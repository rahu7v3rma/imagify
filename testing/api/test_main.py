import requests
from testing.utils.env import env

BASE_URL = env["API_BASE_URL"]


def test_status_route():
    response = requests.get(f"{BASE_URL}/status")
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "socialify api status",
        "data": None,
    }


def test_not_found_route():
    response = requests.get(f"{BASE_URL}/nonexistent")
    assert response.status_code == 404
    assert response.json() == {
        "success": False,
        "message": "route not found",
        "data": None,
    }


def test_error_route():
    response = requests.get(f"{BASE_URL}/error")
    assert response.status_code == 500
    assert response.json() == {
        "success": False,
        "message": "internal server error",
        "data": None,
    }
