from datetime import datetime
import time

#weekly

#1 M9:30
#2 M:10:30
#3 M: 11:30

#4 T: 10:30
#5 T: 11:30
#6 T: 1:30
#7 T: 2:30

#self.shifts = ['W', 'R', 'F']

#edge cases
#self.names = {'Pharez': ['W', 'R', 'F'], 'Luke': ['W', 'R'], 'Laura': ['W']}

#self.names = {'Pharez': ['M', 'T'], 'Luke': ['M', 'R', 'T', 'F'], 'Laura': ['M', 'T', 'R', 'F']}
#expected case

#self.names = {'Pharez': ['M', 'T'], 'Luke': ['M','T', 'F'], 'Laura': ['M', 'T', 'R', 'F']}

#assigned = []
#self.unassigned  = ['Luke', 'Laura', 'Pharez']

#self.shift_assignments = {}

#do we try back tracking first?
#lets do brute force first and then optimize later so

#or what about dynamic programming?
#recursion?
#what to return it as? yo no say
#for now display this on the screen
#option to download


class ScheduleWeekly:

	def __init__(self, payload):
		self.shifts = payload['shifts']
		self.names = payload['names']
		self.unassigned = list(payload['names'].keys())
		self.assigned = []
		self.shift_assignments = {}


	def schedule(self):
		i = 0
		backtrack = True

		while i != len(self.unassigned):
			name = self.unassigned[i]

			if name in self.shift_assignments:
				#get the index of shift and continue
				shift = self.shift_assignments[name]
				self.assigned.remove(shift)
				last_shift_index = self.shifts.index(shift) + 1
				del self.shift_assignments[name]

			else:
				last_shift_index = 0		

			for j in range(last_shift_index, len(self.shifts)):

				if self.shifts[j] not in self.names[name] and self.shifts[j] not in self.assigned:
					self.shift_assignments[name] = self.shifts[j]
					self.assigned.append(self.shifts[j])
					i += 1
					backtrack = False
					break			
			
			if backtrack:
				i -= 1
			backtrack = True
			
			if i == -1:
				return("Could not schedule, Conflict with two or more people having one availability at the same time OR\n" 
						"someone is not availble for any of the shifts")

		shift_assignments = {y:x for x,y in self.shift_assignments.items()}
		return shift_assignments