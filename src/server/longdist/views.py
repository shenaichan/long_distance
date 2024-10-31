from django.shortcuts import render

def index(request):
    return render(request, 'base.html')  # Path to Vite's output HTML

def reply(request, reply_id):
    return render(request, 'base.html')  # Path to Vite's output HTML

def claim(request, claim_id):
    return render(request, 'base.html')  # Path to Vite's output HTML
