import requests 
from bs4 import BeautifulSoup 
import csv
import re

URL = 'https://en.wikipedia.org/wiki/Lady_Gaga'
r = requests.get(URL) 
# print(r.content) 

soup = BeautifulSoup(r.content, 'html.parser') 

# table = soup.find('div', attrs = {'id':'container'})
# print(table.prettify())

results = soup.find('coherently')
# print(results.txt)
soup.find('body')

text = soup.find_all(text=True)

output = ''
blacklist = [
	'[document]',
	'noscript',
	'header',
	'html',
	'meta',
	'head', 
	'input',
	'script',
	# there may be more elements you don't want, such as "style", etc.
]

for t in text:
	if t.parent.name not in blacklist:
		output += '{} '.format(t)

# keyword = output.find("except")

aString = output
keyword = [m.start() for m in re.finditer('happy', output)]

print(keyword)

# with open('url.txt', 'w', encoding='utf-8') as f_out:
    # f_out.write(soup.prettify())