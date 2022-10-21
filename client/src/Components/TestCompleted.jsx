import React from 'react'

const TestCompleted = () => {
  return <div className="container-fluid d-flex justify-content-center align-items-center" style={{height:"100vh", backgroundColor:"#DCDCDC"}}>
    <div className="shadow p-5 bg-light" style={{maxWidth:"600px"}}>
        <div className="card-body d-flex justify-content-center align-items-center">
            <div>
                <h3>Thank You...</h3>
                <p className='mb-0'>Your test has been successfully submitted, we hope you score the best.</p>
            </div>
        </div>
    </div>
  </div>
}

export default TestCompleted