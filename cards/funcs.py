def get_photos(request,inputs):
    result_arr = []
    for x in range(inputs):
        result_arr.append(request.FILES.getlist(f'photo-{x+1}'))
    
    return result_arr