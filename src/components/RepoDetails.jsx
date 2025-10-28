// import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import Button from '@mui/material/Button';
import './styles/RepoDetails.css';
export default function RepoDetails(){
 const {repoName}=useParams();
const navigate=useNavigate();
 const handleClick = (url) => {
     window.open(url, '_blank');
  };


const {data:repoData, isLoading:loading,isError,error}=useQuery({
  queryKey:['repoDetails',repoName],
  queryFn:async()=>{
    const data=await fetch(`https://api.github.com/repos/godaddy/${repoName}`);
      if (!data.ok) {
      throw new Error('Failed to fetch repository');
    }
    const newData=await data.json();
    return newData;
  }
});

const {data:languages=[]}=useQuery({
  queryKey:['repoLanguages',repoName],
  queryFn:async()=>{
    const data=await fetch(repoData?.languages_url);
     if (!data.ok) {
      throw new Error('Failed to fetch languages');
    }
    const newData=await data.json();
    return Object.keys(newData);
  },
  enabled:!!repoData?.languages_url
});
if (loading) {
  return (
    <div style={{ padding: 20 }}  data-testid="MuiSkeleton-root">
      <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="rectangular" width="100%" height={100} />
    </div>
  );
}

 if (isError) {
    return (
      <div className="error">
        Error loading repositories: {error.message}
      </div>
    );
  }

if (!repoData) {
  return <div>Repository not found.</div>;
}




 return( 
 <div
 className="repo-details-container"
 
 >
  <Button className="repo-back-btn" aria-label="Go back to repository list" onClick={() => navigate(-1)}>← Back</Button>

 <div
className="repo-details"
>
    <div className="repo-header">
      <div className="repo-header-content">
        <h3>{repoName}</h3> 
          <div className="repo-description">{repoData?.description}</div>
      </div>
      <Button className="github-view-btn"  aria-label="View on Github" onClick={()=>handleClick(repoData?.html_url)}
  >
    View on Github
    </Button>
          
    </div>
     <div>
      <div><strong>Languages: </strong>
        {languages.length>0?languages.join(','):'No languages listed'}
      </div>
       <div><strong>Forks Count: </strong>
        {repoData?.forks_count}
      </div>
      <div><strong>Open Issues Count: </strong>
        {repoData?.open_issues_count}
      </div>
      <div>
       <strong>Watchers Count: </strong>
        {repoData?.watchers_count}
      </div>
     </div>
    </div>
  </div>)
}