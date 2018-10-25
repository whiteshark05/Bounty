import React from 'react'


export const DisplayUserInfo = ({accountID, account}) => {
    return (
      <div className = "user-info-table">
      <h3>Account information</h3>
      <table className = 'center'>
        <tbody>
          <tr>
            <th>Account ID</th>
            <td>{accountID}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{account.address}</td>
          </tr>
          <tr>
            <th>Balance(Eth)</th>
            <td>{account.balance}</td>
          </tr>
        </tbody>
      </table>
      </div>
    )
}