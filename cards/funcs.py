def get_photos(request):
    result_arr = []
    for x in range(len(request.FILES)):
        result_arr.append(request.FILES.getlist(f'photo-{x+1}'))
    return result_arr