import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Button from '@mui/material/Button';
import { useQuery } from "@tanstack/react-query";
import './styles/RepoList.css';

export default function RepoList() {
  const navigate = useNavigate();

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const res = await fetch("https://api.github.com/orgs/godaddy/repos");
      if (!res.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const resData = await res.json();
      return resData;
    },
    retry: false
  });

  if (isError) {
    return (
      <div className="error">
        Error loading repositories: {error.message}
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return <div>No repositories found.</div>;
  }

  return (
    <div className="repo-list-wrapper">
      <h1 className="repo-list-header">GoDaddy Repositories</h1>

      {isLoading ? (
        <div className="container" data-testid="MuiSkeleton-root">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div key={idx} className="data-container">
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="90%" height={20} style={{ marginBottom: 8 }} />
              <Skeleton variant="rectangular" width={100} height={36} />
            </div>
          ))}
        </div>
      ) : (
        <article className="container">
          {data.map((ele, idx) => (
            <div key={idx} 
            className="data-container" 
            >
              <h2>{ele.name}:</h2>
              <p>{ele.description || "No description available"}</p>
              <Button
                onClick={() => navigate(`/repo/${ele?.name}`)}
                className="repo-details-btn"
                aria-label="View Details"
              >
                View Details
              </Button>
            </div>
          ))}
        </article>
      )}
    </div>
  );
}
