MOCHA=node_modules/.bin/mocha
ISTANBUL=node_modules/.bin/istanbul
COVERALLS=node_modules/coveralls/bin/coveralls.js
TESTS=$(shell find test/ -name "test*.js" -not -path "*fixtures/*")

test:
	$(MOCHA) -R spec $(TESTS) 
test-coverage:
	rm -rf lib-cov/
	rm -rf html-report/
	$(ISTANBUL) instrument lib/ -o lib-cov/
	READFILELINES_COV=1 ISTANBUL_REPORTERS=lcov,text-summary,html $(MOCHA) --reporter mocha-istanbul $(TESTS)
test-coveralls: 
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	cat lcov.info | $(COVERALLS)


.PHONY: test test-coverage test-coveralls
	
