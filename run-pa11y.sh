#!/bin/bash

# Script to run pa11y accessibility checker against local running copy
# generates html reports stored in test/accessibility
# requires pa11y installed globally `npm install -g pa11y`
# requires an existing claim in the application so screens load correctly

if [ $# -ne 6 ]; then
  echo $0: usage: ./run-pa11y encryptedReferenceId claimId encryptedReference submittedDob submittedEncryptedReference submittedClaimId
  exit 1
fi

encryptedReferenceId=$1
claimId=$2
encryptedReference=$3

submittedDob=$4
submittedEncryptedReference=$5
submittedClaimId=$6

# This is a list of urls visited taken from the first-time-claim e2e test
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/" > "test/accessibility/01-root.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/start" > "test/accessibility/02-start.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/new-eligibility" > "test/accessibility/03-dob.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/new-eligibility/1955-05-01" > "test/accessibility/04-relationship.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/new-eligibility/1955-05-01/partner" > "test/accessibility/05-benefit.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/new-eligibility/1955-05-01/partner/income-support" > "test/accessibility/06-about-the-prisoner.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/new-eligibility/1955-05-01/partner/income-support/$encryptedReferenceId" > "test/accessibility/07-about-you.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/new-claim" > "test/accessibility/08-future-past.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/new-claim/past" > "test/accessibility/09-visit-details.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/has-escort" > "test/accessibility/10-escort-yn.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/escort" > "test/accessibility/11-escort.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/has-child" > "test/accessibility/12-child-yn.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/child" > "test/accessibility/13-child.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId" > "test/accessibility/14-expenses.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/car?bus=&refreshment=" > "test/accessibility/15-car.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/bus?refreshment=" > "test/accessibility/16-bus.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/refreshment" > "test/accessibility/17-refreshment.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/summary" > "test/accessibility/18-summary.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/summary/file-upload?document=VISIT_CONFIRMATION&eligibilityId=7" > "test/accessibility/19-fileupload.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/apply/first-time/eligibility/$encryptedReferenceId/claim/$claimId/bank-account-details" > "test/accessibility/20-bankaccount.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/application-submitted/$encryptedReference" > "test/accessibility/21-confirmation.html"

# This is a list of urls visited taken from the repeat-claim-duplicate e2e test
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/start-already-registered" > "test/accessibility/22-start-already-registered.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/your-claims/$submittedDob/$submittedEncryptedReference" > "test/accessibility/23-your-claims.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/your-claims/$submittedDob/$submittedEncryptedReference/check-your-information" > "test/accessibility/24-check-your-information.html"
pa11y --standard WCAG2AA --ignore "notice" --reporter html "http://localhost:3000/your-claims/$submittedDob/$submittedEncryptedReference/$submittedClaimId" > "test/accessibility/25-your-claim.html"
