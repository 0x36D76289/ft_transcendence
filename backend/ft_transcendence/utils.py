def clean_serializer_errors(errors):
	string = ""
	for field, err in errors.items():
		string += f"{field}: {[str(e) for e in err]},"
	return string[:-1]
