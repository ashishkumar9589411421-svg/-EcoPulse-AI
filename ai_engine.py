import os
import google.generativeai as genai

def get_recommendations(record):
    """
    Generate personalized recommendations based on the user's latest carbon record
    using the Gemini API.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return ["Reduce car usage by taking public transport.", "Switch to LED bulbs to save energy.", "Start a compost bin to reduce waste."]
        
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-pro') # Using pro model for better generation
        
        prompt = f"""
        You are a sustainability expert AI for 'EcoPulse AI'. 
        Analyze the following user's recent carbon emissions (in kg CO2) and provide 3 short, actionable, and highly personalized recommendations to reduce their footprint.
        
        Transportation: {record.transport_emissions} kg
        Home Energy: {record.energy_emissions} kg
        Food: {record.food_emissions} kg
        Waste: {record.waste_emissions} kg
        Water: {record.water_emissions} kg
        Total: {record.total} kg
        
        Return exactly 3 sentences. No bullet points, just three distinct sentences separated by newlines. Do not be generic. Include calculated impacts if possible.
        Example: "Your transportation contributes over 50% of emissions; reducing car usage by 10km/week saves 95kg CO2 annually."
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        recommendations = [sentence.strip() for sentence in text.split('\n') if sentence.strip()]
        return recommendations[:3]
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return ["Consider carpooling to reduce transport emissions.", "Unplug devices when not in use.", "Try to eat a plant-based meal once a week."]
