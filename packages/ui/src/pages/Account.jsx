import { useState, useEffect } from 'react';
import PageCrumb from '../components/PageCrumb';
import './Account.css';

function Account() {
  return (
    <div className='background'>
      <div id='stars'/>
      <div id="gradient">
        <div id="header">
          <PageCrumb uri={'/dashboard/account'}/>
          <h1>Account</h1>
        </div>
      </div>
      <div id="account-page">
      </div>
    </div>
  )
}

export default Account