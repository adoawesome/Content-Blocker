import requests 
from bs4 import BeautifulSoup 
import csv
import re

URL = 'https://en.wikipedia.org/wiki/Lady_Gaga'
r = requests.get(URL) 
soup = BeautifulSoup(r.content, 'html.parser') 

text = soup.find_all(text=True)

output = ''
blacklist = ['[document]','noscript','header','html','meta','head', 'input', 'script',]

for t in text:
	if t.parent.name not in blacklist:
		output += '{} '.format(t)

aString = output
keyword = [m.start() for m in re.finditer('happy', output)]

print(keyword)
