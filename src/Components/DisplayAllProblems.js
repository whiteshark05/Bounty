import React from 'react'

export const DisplayAllProblems = ({problemCount, index, problem}) => {
    return (
      <table className="center">
        <tbody>
          <tr>
            <th>Total Problems</th>
            <td>{problemCount}</td>
          </tr>
          <tr>
            <th>Problem ID</th>
            <td>{index}</td>
          </tr>
          <tr>
            <th>Problem Setter Address</th>
            <td>{problem.setterAddress}</td>
          </tr>
          <tr>
            <th>Tittle</th>
            <td>{problem.name}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{problem.description}</td>
          </tr>
          <tr>
            <th>Input</th>
            <td>{problem.input}</td>
          </tr>
          <tr>
            <th>Output</th>
            <td>{problem.output}</td>
          </tr>
          <tr>
            <th>Price Tag(Eth)</th>
            <td>{problem.priceTag}</td>
          </tr>
        </tbody>
      </table>
    )
  }