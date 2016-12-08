export default `
    <p data-editable-block>AWARD NOTICE</p>

    <ul>
        <li>Award Date: <span data-editor-readonly="true">\${award.startDate}</span></li>
        <li>Award No. (FAIN): <span data-editor-readonly="true">\${award.id}</span></li>
        <li>Proposal No.: <span data-editor-readonly="true">\${proposal.id}</span></li>
        <li>Managing Division Abbreviation: <span data-editor-readonly="true">\${award.division.abbrev}</span></li>
    </ul>

    <div data-editable-block>
        <p><span data-editor-readonly="true">\${aor.fullName}</span><br /><span data-editor-readonly="true">\${aor.title}</span><br /><span data-editor-readonly="true">\${institution.name}</span><br /><span data-editor-readonly="true">\${institution.address}</span><br />DUNS ID: <span data-editor-readonly="true">\${institution.dunsId}</span></p>
        <p>Dear <span data-editor-noaccess="true">\${aor.prefix}</span> <span data-editor-noaccess="true">\${aor.lastName}</span>,</p>
        <p>The National Science Foundation hereby awards a grant of <span data-editor-readonly="true">\${award.total}</span> to <span data-editor-readonly="true">\${institution.name}</span> for support of the project described in the proposal refereced above. The award is expected to total <span data-editor-noaccess="true">\${award.total}</span>.</p>
        <p><span data-editor-noaccess="true">This project, entitled "\${award.title}" is under the direction of \${pi.fullName}, in collaboration with the following proposals</span></p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Proposal No.</th>
                <th>PI Name/Institution</th>
            </tr>
        </thead>
        <tbody>
            \${proposal.collab.tableRows}
        </tbody>
    </table>

    <div data-editable-block>
        <p>This award starts \${award.startDate} and ends \${award.endDate}.</p>
        <p>This grant is awarded pursuant to the authority of the National Science Foundation Act of 1950, as amended (42 U.S.C. 1861-75) and is subject to NSF Grant General Conditions (GC-1), dated December 26, 2014, available at <a href="http://www.nsf.gov/awards/managing/general_conditions.jsp" target="_blank">http://www.nsf.gov/awards/managing/general_conditions.jsp</a>.</p>
        <p>This award is subject to the Uniform Administrative Requirements, Cost Principles and Audit Requirements for Federal Awards (Uniform Guidance). NSF's implementation of the Uniform Guidance is contained in the Grant Conditions referenced in this award.</p>
        \${clause.fdp}
        \${clause.ffata}
        <p>The attached budget indicates the amounts, by categories, on which NSF has based its support.</p>
        <p>Please view the project reporting requirements for this award at the following web address [<a href="https://reporting.research.gov/fedAwardId/\${award.id}" target="_blank">https://reporting.research.gov/fedAwardId/\${award.id}</a>].</p>
        <p>The cognizant NSF program office for this grant is \${po.fullName}, \${po.phoneNumber}.</p>
        <p>The cognizant NSF grants official contact is \${portfolio.manager.fullName}, \${portfolio.manager.phoneNumber}.</p>
        <p>Sincerely,</p>
        <p>\${grant.officer.fullName}<br />Grants and Agreements Officer</p>
        <p>\${solicitation.id}, \${solicitation.name}<br />\${institution.emailAddress}</p>
        <p>\${award.division.abbrev}-\${award.id} \${amendment.id}<br />SUMMARY PROPOSAL BUDGET</p>
        <p>Funds<br />Person MOS granted</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>CAL</th>
                <th>ACAD</th>
                <th>Summary</th>
                <th>By NSF</th>
            </tr>
        </thead>
        <tbody>
            \${award.budget.tableRows}
        </tbody>
    </table>
`;