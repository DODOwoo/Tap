from bottle import *

@route('/')
def loadxml():
	return template('loadxml.html')

@route('/s/<fname>')
def loadbook(fname):
	return static_file(fname,'./s')

run(host='localhost', port=8089, debug=True)
