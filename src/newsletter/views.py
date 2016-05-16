from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import render
from .forms import ContactForm, SignUpForm

from .models import SignUp
# Create your views here.
def home(request):
	title = 'Sign Up Now'
	# if request.user.is_authenticated():
	# 	title = "My Title %s" %(request.user)
	#add a form
	# if request.method == "POST":
	# 	print request.POST
	form = SignUpForm(request.POST or None)
	context = {
			"title" : title,
			"form" : form,
	}

	if form.is_valid():
		instance = form.save(commit=False)
		instance.save()
		print instance
		print instance.timestamp

		context = {
			"title" : "Thank you",
		}

	if request.user.is_authenticated() and request.user.is_staff:
		#print(SignUp.objects.all())
		queryset = SignUp.objects.all().order_by('-timestamp')
			
		context = {
			"queryset": queryset

		}

	return render(request, "home.html", context)

def contact(request):
	title = 'Contact Us'
	form = ContactForm(request.POST or None)

	if form.is_valid():
		form_email = form.cleaned_data.get("email")
		form_message = form.cleaned_data.get("message")
		form_full_name = form.cleaned_data.get("full_name")
		# print email, message, full_name
		subject = 'Site contact form'
		from_email = settings.EMAIL_HOST_USER
		to_email = [from_email]
		contact_message = "%s: %s via %s"%(form_full_name, form_message, from_email)
		send_mail(subject, contact_message, from_email, to_email, fail_silently=False)

	context = {
		"form": form,
		"title": title,
	}
	return render(request, "form.html", context)