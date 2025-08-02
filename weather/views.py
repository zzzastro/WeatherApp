from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import requests
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def home(request):
    weather_data = {}
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            location = data.get("location")
            
            if not location:
                return JsonResponse({"error": "Location parameter is required"})
                
            api_key = settings.WEATHER_API_KEY
            
            # Debug: Check what key is actually being used
            print(f"DEBUG: Using API key: '{api_key}'")
            print(f"DEBUG: Key length: {len(api_key) if api_key else 'None'}")
            
            if not api_key:
                return JsonResponse({"error": "API key not configured"})
                
            api_url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"

            print(f"DEBUG: Full URL: {api_url}")
            
            response = requests.get(api_url)
            
            print(f"DEBUG: Response status: {response.status_code}")
            print(f"DEBUG: Response: {response.text}")
            
            if response.status_code == 200:
                weather_data = response.json()
                weather_data['full_location'] = f"{weather_data['name']}, {weather_data['sys']['country']}"
            else:
                try:
                    error_data = response.json()
                    weather_data["error"] = f"API Error: {error_data.get('message', 'Unknown error')}"
                except:
                    weather_data["error"] = f"API Error: {response.text}"

            return JsonResponse(weather_data)
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"})

    return JsonResponse({"error": "Invalid request method."})
