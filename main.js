$(document).ready(function () {

  $('.start-button').click(function () {
    window.location.href = "http://127.0.0.1:5500/index.html";

  })

  // generate documents :
  let documents = []
  let docNumber = 20;
  for (let i = 1; i <= docNumber; i++) {
    let time = (Math.random() * 5 + 5).toFixed(1)
    $('.doc-container').append(` <span id=${i} class="document">
  <p><span class="document-title">Doc${i} </span> <br> ${time} s</p>
</span>`)

    documents = [...documents, { id: i, time: time }]
  }



// function for doing every jobs :
  function asyncOperation(job) {
    return new Promise(function (response, reject) {
      setTimeout(() => {
        response(job)
      }, job.time * 1000);
    })

  }
  console.log(documents)


  const parallelWorkerCount = 4;

  $('.doc-counter').html(`Document : ${docNumber}`)
  $(' .worker-counter').html(`Worker : ${parallelWorkerCount}`)

  //generate worker name
  for (let m = 1; m <= parallelWorkerCount; m++) {
    $('.worker-container').append(` <span class="worker-space col">
    <p class="worker-name">${String.fromCharCode(64 + m)}</p>
  </span>`)
  }

  // manage parallel works
  (async function () {
    const queue = documents
    const queueGenerator = (function* () {
      for (const item of queue) yield item;
    })();



    const workers = ','.repeat(parallelWorkerCount).split(',').map((v, i) => i + 1)

    const allAsyncOps = []
    let queueEndReached = false;

    workers.forEach(async worker => {
      console.log("Worker", worker, "started!")
      for (const job of queueGenerator) {

        // delete current job from todo
        let $currentJob = $('#' + job.id).clone(true)
        $('#' + job.id).remove().hide(1000)

        // show current job in working... :
        $(`.worker-space:eq(${worker - 1})`).append($currentJob)
        $($currentJob).hide().show(1000)


        const jobTime = job.time
        console.log("Worker", worker, "PICKED Job", job.id, `(takes ${jobTime}s)`)
        const asyncOp = asyncOperation(job)
        allAsyncOps.push(asyncOp)
        const jobResult = await asyncOp
        console.log("Worker", worker, "FINISHED Job", jobResult.id)

        // transport current job from working to Done : 
        let $jobDone = $('#' + job.id).clone(true)
        $('#' + job.id).remove()
        $('#done').append($jobDone)
        $(`#done #${job.id}`).hide().show(1000)
        console.log($('#' + job.id))
      }
      console.log("Worker", worker, "has no job!")
      if (!queueEndReached) {
        console.log("First jobless worker. End of Queue Reached! Waiting for all to finish.")
        Promise.all(allAsyncOps).then(results => console.log("ALL FINISHED!!!", results))
        queueEndReached = true;
      }
    })

  })()

















})





// const queueSize = 10
// const parallelWorkerCount = 3

// const sampleQueue = ','.repeat(queueSize).split(',').map(()=>Math.floor(Math.random()*1000))
// // console.log('sampleQueue:', sampleQueue)

// const queueGenerator = (function* () {
//   for (const item of sampleQueue) yield item;
// })()
// console.log(sampleQueue)
// // Demonstrate how picking a work from the queue works using the queueGenerator
// console.log('pick a work:', queueGenerator.next().value)
// console.log('pick a work:', queueGenerator.next().value)
// console.log('pick a work:', queueGenerator.next().value)

// const sampleAsyncOp = (time, job) => new Promise((res, rej) => setTimeout(() => res(job), time))

// const workers = ','.repeat(parallelWorkerCount).split(',').map((v, i) => i + 1)

// const allAsyncOps = []
// let queueEndReached = false;

// workers.forEach(async worker => {
//   console.log("Worker", worker, "started!")
//   for (const job of queueGenerator) {
//     const jobTime = Math.random() * 6000 + 500;
//     console.log("Worker", worker, "PICKED Job", job, `(takes ${Math.floor(jobTime / 100) / 10}s)`)
//     const asyncOp = sampleAsyncOp(job, jobTime)
//     allAsyncOps.push(asyncOp)
//     const jobResult = await asyncOp
//     console.log("Worker", worker, "FINISHED Job", job, `(confirmed ${jobResult == job})`)
//   }
//   console.log("Worker", worker, "has no job!")
//   if (!queueEndReached) {
//     console.log("First jobless worker. End of Queue Reached! Waiting for all to finish.")
//     Promise.all(allAsyncOps).then(results => console.log("ALL FINISHED!!!", results))
//     queueEndReached = true;
//   }
// })

