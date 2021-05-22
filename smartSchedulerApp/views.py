import json
from collections import OrderedDict
from pathlib import Path

from django.shortcuts import render
from .models import ToDoListItem
from django.http import HttpResponseRedirect 
from django.http import HttpResponse
from django.http import FileResponse
from django.views.decorators.csrf import csrf_exempt

from .businesslogic.scheduler import Scheduler
from .businesslogic.custom_times_scheduler import ScheduleWeekly

def example(request):
	all_to_do_items = ToDoListItem.objects.all()
	return render(request, 'example.html', {'all_items': all_to_do_items})

def addTodoView(request):
	#x = request.POST['content']
	#new_item = ToDoListItem(content = x)
	#new_item.save()
	return HttpResponseRedirect('/example')

@csrf_exempt
def scheduleView(request):
	return render(request, 'scheduleDailyPage.html')

@csrf_exempt
def scheduleRaDuty(request):
	if request.method != 'POST':
		return HttpResponse(status=405)
	payload = json.loads(request.body)
	scheduler = Scheduler(payload)
	scheduler.start_schedule()
	print(payload)
	path = Path(__file__).resolve().parent
	path = Path(path, 'ms_files', scheduler.filename)
	
	return FileResponse(open(f'{path}.xlsx', 'rb'), status=200)

def participantsView(request):
	return render(request, 'participants.html')

def result(request):
	result = {'M':{'9:15': 'Nat', '12:00':'Nat'}, 'T':{'9:15':'Kill'},'R': {'10:15:''Luke'}, 'W': {'12:00':'Laura'}, 'F': {'12:00':'Pharez'}}
	days = ['M', 'T', 'W', 'R', 'F']
	rows = [{'9:15': 'Nat', '12:00':'Nat', '': ' ', '  ': ' ', '    ': ' ',}, {'9:15': 'Nat', '12:00':'Nat'}, {'10:15:''Luke',}, {'12:00':'Laura'}]
	return render(request, 'result.html', {'days': days, 'rows':rows})

@csrf_exempt
def makeSchedule(request):
	if request.method != 'POST':
		return HttpResponse(status=405)

	payload = json.loads(request.body)	
	payload['shifts'] = processPayload(payload)

	s = ScheduleWeekly(payload)
	result = s.schedule()

	processResult()
	if type(result) is str:
		response = HttpResponse(result)
		response['completed'] = False
		return response
	else:
		result = processResult();
		days = ['M', 'T', 'W', 'R', 'F', 'S', 'S']
		rows = [{'9:15': 'Nat', '12:00':'Nat', '': ' ', '  ': ' ', '    ': ' ',}, {'9:15': 'Nat', '12:00':'Nat'}, {'10:15:''Luke',}, {'12:00':'Laura'}]

		response = render(request, 'result.html', {'days': days, 'rows':rows})
		response['completed'] = True
		return response

def processResult():
	dic =  {'M-12:30 PM': ['Pharez'], 'M-11:30 AM':['Jayden'], 'T-11:30 AM':['Marcus'], 'M-1:30 PM':['Kevin' ], 'T-12:30 PM':['Tiana'] }
	c  = {'M':0,'T':1,'W':2,'R':3,'F':4,'S':5,'Su':6}
	new_dic = {}
	for key in dic:
		new_key =  key
		n = c.get(new_key[0])
		print(n)
		if n != None:
			new_key = new_key[:0] + str(c[new_key[0]]) + new_key[1:]
			new_dic[new_key] = dic[key]
	ordered_dict = OrderedDict(sorted(new_dic.items()))
	
	res = [[{}]]

	for x in ordered_dict:
		
		placed = False
		for i in range(len(res)):
			if x not in res[i]:
				res[i][x] = ordered_dict[x]
				placed = True
				break

		if not placed:
			res.append([{}])


def processPayload(payload):
	#turn cols into rows
	shifts = []
	unprocessedShifts = list(payload['shifts'].values())

	for i in range(len(unprocessedShifts[0])):
		day = unprocessedShifts[0][i]
		if day == "Thursday":
			day = "R"
		else:
			day = day[0]
		
		for j in range(1, len(unprocessedShifts)):
			if unprocessedShifts[j][i] != " ":
				shifts.append( f"{day}-{unprocessedShifts[j][i]}" )

	return shifts

#{'Pharez': 'M-12:30 PM', 'Jayden': 'M-11:30 AM', 'Kevin': 'M-1:30 PM', 'Marcus': 'T-11:30 AM', 'Tiana': 'T-12:30 PM'}
#{'M-12:30 PM': ['Pharez'], 'M-11:30 AM':['Jayden'], 'M-1:30 PM':['Kevin' ], 'T-11:30 AM':['Marcus'], 'T-12:30 PM':['Tiana'] }
'''
dic = {'M':0,'T':1,'W':2,'R':3,'F':4,'S':5,'Su':6}

map it

#create_rows
[]
i = 0
while dic is not empty
for item in dic
if item in lis[0]:

'''