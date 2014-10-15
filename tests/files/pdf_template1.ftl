<#assign workspace=objects[0]>
<#assign submission=objects[1]>

<html>
<body>
<p>
    This
    Report
    was submitted on ${submission.submittedOn?number_to_datetime} from [IP_ADDRESS]
    by
${workspace.properties.principalInvestigator.firstName}
${workspace.properties.principalInvestigator.lastName}
    (
    <a href="${workspace.properties.principalInvestigator.email}">
    ${workspace.properties.principalInvestigator.email}
    </a>
    )
</p>
<p>
    If there is an issue with this submission, we will contact you by email.
</p>

<!-- Grant Details -->
<h2>Grant Details</h2>
<table>
    <thead>
    <tr>
        <th>Key</th>
        <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <#list workspace.properties.details as detail>
    <tr>
        <td>${detail.key}</td>
        <td>${detail.value}</td>
    </tr>
    </#list>
    </tbody>
</table>

<h2>Financials</h2>

<h3>Summary</h3>
<table>
    <tbody>
    <tr>
        <td>Report Date</td>
        <td></td>
    </tr>
    <tr>
        <td>Total Grant Amount</td>
        <td>${submission.data.rewardAmount}</td>
    </tr>
    <tr>
        <td>Total Received to Date</td>
        <td>${submission.data.fundsReceived}</td>
    </tr>
    <tr>
        <td>Total Expenditures this Report</td>
        <td>${submission.data.expensesTotal}</td>
    </tr>
    <tr>
        <td>Total Encumbrances</td>
        <td>${submission.data.encumbrancesTotal}</td>
    </tr>
    <tr>
        <td>Carry-Over Balance</td>
        <td>${submission.data.carryOverBalanceFromLastYear}</td>
    </tr>
    </tbody>
</table>

<h3>Personnel Expenses</h3>
<table>
    <thead>
    <tr>
        <th>Line Item Category</th>
    </tr>
    <tr>
        <th>Expenditures</th>
    </tr>
    <tr>
        <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    <#list submission.data.personnelExpenses as expense>
    <tr>
        <td>${expense.category!""}</td>
        <td>${expense.actual!""}</td>
        <td>${expense.notes!""}</td>
    </tr>
    </#list>
    </tbody>
</table>

<h3>Direct Costs</h3>
<table>
    <thead>
    <tr>
        <th>Line Item Category</th>
    </tr>
    <tr>
        <th>Expenditures</th>
    </tr>
    <tr>
        <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    <#list submission.data.directCosts as expense>
    <tr>
        <td>${expense.category!""}</td>
        <td>${expense.actual!""}</td>
        <td>${expense.notes!""}</td>
    </tr>
    </#list>
    </tbody>
</table>

<h3>Encumbrances</h3>
<table>
    <thead>
    <tr>
        <th>Line Item Category</th>
    </tr>
    <tr>
        <th>Expenditures</th>
    </tr>
    <tr>
        <th>Notes</th>
    </tr>
    </thead>
    <tbody>
    <#list submission.data.encumbrances as expense>
    <tr>
        <td>${expense.category!""}</td>
        <td>${expense.amount!""}</td>
        <td>${expense.notes!""}</td>
    </tr>
    </#list>
    </tbody>
</table>

</body>
</html>