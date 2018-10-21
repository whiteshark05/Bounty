pragma solidity ^0.4.24;

contract Bounty {
    address owner;
    uint[] problemIDs;
    uint[] solutionIDs;

    
    mapping(uint => Problem) problems;
    mapping(uint => Solution) solutions;
    mapping(uint => uint[]) solutionsToProblem;

    struct Problem {
        address setterAddress;
        string name;
        string description;
        string input;
        string output;
        uint priceTag;
        bool isActive;
    }
    
    struct Solution {
        address solverAddress;
        uint problemID;
        string content;
        string output;
        bool isCorrect;
    }
    
    
    // Initialise the contract
    constructor() public payable {
        owner = msg.sender;
    } 
    
    //Fallback function
    function () public payable {}
    

    // Get owner address
    function getOwner() public view 
        returns (address)
    {
        return owner;
    }

    // Hello
    function greet() public pure 
        returns (string) 
    {
        return "Hello";
    }

    // Create Problem
    function createProblem(string name_, string description_, string input_, string output_) public payable
    {
        require(msg.value > 0, "Please deposit more bounties");
        uint newID = problemIDs.length;
        problemIDs.push(newID);
        Problem storage newProblem = problems[newID];
        newProblem.setterAddress = msg.sender;
        newProblem.name = name_;
        newProblem.description = description_;
        newProblem.input = input_;
        newProblem.output = output_;
        newProblem.priceTag = msg.value;  // Check the unit of msg.value (ether or wei?)
        newProblem.isActive = true;
    }
    
    
    // Get ProblemCount
    function getProblemCount () public view
        returns (uint problemCount)
    {
        problemCount = problemIDs.length;
    }
    
    // Get ProblemSetterAddress
     function getProblemSetterAddress(uint id_) public view
        returns (address setterAddress_)
    {
        setterAddress_ = problems[id_].setterAddress;
    }

    // Get Problem
    function getProblem(uint id_) public view
            returns (address setterAddress, string name, string description, string input, string output, uint priceTag, bool isActive)
    {
        Problem storage currentProblem = problems[id_];
        require(currentProblem.isActive, "Invalid ID");
        return(
        currentProblem.setterAddress,
        currentProblem.name,
        currentProblem.description,
        currentProblem.input,
        currentProblem.output,
        currentProblem.priceTag,
        currentProblem.isActive);
    }
    
    
    // Update Problem
    function updateProblemName(uint id_, string name_) public
    {
        require(msg.sender == problems[id_].setterAddress, "Only problem setter can edit");
        require(problems[id_].isActive, "Invalid ID");
        problems[id_].name = name_;
    }
    
    
    function updateProblemDescription(uint id_, string description_) public
    {
        require(msg.sender == problems[id_].setterAddress, "Only problem setter can edit");
        require(problems[id_].isActive, "Invalid ID");
        problems[id_].description = description_;
    }
    
    
    function updateProblemInput(uint id_, string input_) public
    {
        require(msg.sender == problems[id_].setterAddress, "Only problem setter can edit");
        require(problems[id_].isActive, "Invalid ID");
        problems[id_].input = input_;
    }
    
    
    function updateProblemOutput(uint id_, string output_) public
    {
        require(msg.sender == problems[id_].setterAddress, "Only problem setter can edit");
        require(problems[id_].isActive, "Invalid ID");
        problems[id_].output = output_;
    }
    
    
    function updateProblemPriceTag(uint id_) public payable
    {
        require(msg.sender == problems[id_].setterAddress, "Only problem setter can edit");
        require(problems[id_].isActive, "Invalid ID");
        problems[id_].priceTag += msg.value;
    }
    
    
    // Remove Problem (inactive)
    function removeProblem(uint id_) public {
        Problem storage currentProblem = problems[id_];
        require(msg.sender == currentProblem.setterAddress, " Only problem setter can remove the problem");
        require(currentProblem.isActive, "Problem already archieved");
        currentProblem.isActive = false;
        uint retrieval = currentProblem.priceTag;
        currentProblem.priceTag = 0;
        currentProblem.setterAddress.transfer(retrieval);
    }
    
    
    // Check Answer [internal]
    function createSolution(uint id_, string content_, string output_) public 
    {   
        // ??????required id_ valid
        require(id_<=problemIDs.length, "Problem not found");
        uint newSolutionID = solutionIDs.length;
        solutionIDs.push(newSolutionID);
        // Add new ID to solutionsToProblem mapping
        solutionsToProblem[id_].push(newSolutionID);
        //Create new solution and map to solutionID
        Solution storage solution = solutions[newSolutionID];
        solution.problemID = id_;
        solution.content = content_;
        solution.output = output_;
        solution.solverAddress = msg.sender;    
        
        if (keccak256(output_) == keccak256("123")){
            solution.isCorrect = true;
            address winner = solution.solverAddress;
            uint prize = problems[id_].priceTag;
            problems[id_].priceTag = 0;
            winner.transfer(prize);
        }
        else
            solution.isCorrect = false;
        
    }
    
    // Get SolutionCount
    function getSolutionCount () public view
        returns (uint solutionCount)
    {
        solutionCount = solutionIDs.length;
    }

    // View personal solutions (tbd)
    function getSolutionIDsByProblemID(uint problemID_) public view
        returns(uint[] solutionIDs_)
    {
        solutionIDs_ = solutionsToProblem[problemID_];
    }



    function getSolutionBySolutionID(uint solutionID_) public view
        returns(
        address solverAddress, 
        uint problemID,
        string content,
        string output,
        bool isCorrect)
    {
        solverAddress = solutions[solutionID_].solverAddress;
        problemID = solutions[solutionID_].problemID;
        content = solutions[solutionID_].content;
        output = solutions[solutionID_].output;
        isCorrect = solutions[solutionID_].isCorrect;
    }

}