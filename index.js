const axios = require('axios');
// const { timeStamp } = require('console');
const fs = require('fs');
// const { platform } = require('os');


const getCFsubmissions  = async () =>{
    const response = await axios.get('https://codeforces.com/api/user.status?handle=d3nominat0r&from=1&count=100000')
    const submissions = response.data.result;
    const acSubmissions = submissions.filter(submission => submission.verdict === 'OK');
    const res = acSubmissions.map( submission => {
        return {
            "problemName" : submission.problem.name,
            "problemUrl" : `https://codeforces.com/problemset/problem/${submission.problem.contestId}/${submission.problem.index}`,
            "submissionUrl" : `https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`, 
            "problemlanguage" :  submission.programmingLanguage,
            "platform": 'Codeforces',
            // timeStamp : submission.creationTimeSeconds
        }
    });
    console.log(res);
    return res;
}


const controller = async() => {
    try{
        const cfSubmission = await getCFsubmissions();
        let submissions = [];
        submissions = cfSubmission;
        // submissions = [...submissions,...cfSubmission];
        submissions.sort((a,b) => a.timeStamp - b.timeStamp);
        fs.writeFileSync('submissions.json',JSON.stringify(submissions));
        console.log("Total length : ",submissions.length);
    }
    catch(err){
        console.log("Error ", err);
    }
};

const generateReadme = async () =>{
    const allsubmission = JSON.parse(fs.readFileSync('submissions.json'));


    let readme = `# After running this script we get following data

        ## Total problems solved : ${allsubmission.length}
        | Name | My submission | Language | platform | 
        |------|---------------| ---------|----------|
        `;
    for( const submision of allsubmission ){
        const submisionId = submision.submissionUrl.split('/').pop();
        readme += `| [${submision.problemName}](${submision.problemUrl}) | [${submisionId.problemName}](${submision.SubmissionUrl}) | ${submision.problemlanguage} | ${submision.platform})
        `;
    } 

    fs.writeFileSync('readme.md',readme);
};

controller();
generateReadme();