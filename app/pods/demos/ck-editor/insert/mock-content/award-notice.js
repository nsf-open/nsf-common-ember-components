export default `
    <p><strong>AWARD NOTICE</strong></p>

    <p>The following list has styling as well.</p>
    <ul>
        <li>Award Date: <em><span data-editor-noaccess=true data-field-id=Award_Start_Date>AWARD START DATE</span></em></li>
        <li>Award No. (FAIN): <strong><span data-editor-noaccess=true data-field-id=Award_Id>AWARD ID</span></strong></li>
        <li>Proposal No.: <span data-editor-noaccess=true data-field-id=Proposal_Id>PROPOSAL ID</span></li>
        <li>Managing Division Abbreviation: <span data-editor-noaccess=true data-field-id=Managing_Division>MANAGING DIVISION</span></li>
    </ul>
    
    <p>
    AOR NAME: <span data-editor-readonly=true data-field-id=Aor_Name>AOR NAME</span><br />
    INSTITUTION ADDRESS: <span data-editor-readonly=true data-field-id=Inst_Add>INSTITUTION ADDRESS</span><br />
    DUNS ID: <span data-editor-readonly=true data-field-id=Inst_Duns_Id>INSTITUTION DUNS ID</span><br />
    </p>
    
    <p>
    Dear <span data-editor-noaccess=true data-field-id=Aor_Title>AOR TITLE</span>:
    </p>
    
    <p>
    There are two merge fields in this paragraph that have the same field id but different types. The National Science Foundation hereby awards a grant of <span data-editor-noaccess=true data-field-id=Award_Total>AWARD TOTAL</span> to <span data-editor-noaccess=true data-field-id=Inst_Name>INSTITUTION NAME</span> for support of the project described in the proposal referenced above . This award is expected to total <span data-editor-readonly=true data-field-id=Award_Total>AWARD TOTAL</span>.
    </p>
    
    <p>
    This award starts <span data-editor-readonly=true data-field-id=Award_Start_Date>AWARD START DATE</span> and ends <span data-editor-noaccess=true data-field-id=Award_End_Date>AWARD END DATE</span>.
    </p>
    
    <p>
    For any questions, visit the <a href="http://www.nsf.gov/" target="_blank">NSF Website</a>. Please refer to your <strong>AWARD ID</strong> for any questions. Your <strong>Award_Id</strong> is very important. That is why it appears several times in this paragraph. The first two references to it are just texts and now I will include the actual value <span data-editor-readonly=true data-field-id=Award_Id>AWARD ID</span>.
    </p>

`;
