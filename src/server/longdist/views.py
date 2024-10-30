from django.shortcuts import render

def index(request):
    return render(request, 'base.html')  # Path to Vite's output HTML
