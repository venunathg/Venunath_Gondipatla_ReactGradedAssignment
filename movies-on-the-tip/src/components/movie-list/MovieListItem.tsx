import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import IMovie from "../../models/IMovie";


type Props = {
    movie : IMovie,
    tabName: string,
    onDelete: any,
    onAddClick: any
};

const MovieListItem = ( { movie, tabName , onDelete, onAddClick } : Props) => {

    const {
        id,
        title,
        poster,
        year
    } = movie;

    const encodedTitle = encodeURIComponent(title);

    const [data] = useState({
        currentTab : tabName,
        releasedYear : year,
        id: id
    });

    const addMovieToFav = async () => {
        const {id, ...favMovie} = movie;
        onAddClick(favMovie);
    }

    const deleteMovieFromFav = async () => {
        onDelete(id as string);
        console.log('After on Delete');        
    }
 
    return (
        <div>
            <Card className="movie-card">
                <Link to={`/${encodedTitle}`} state={{data:data}}>
                    <div className="poster-container">
                        <Card.Img variant="top" src={`${process.env.REACT_APP_BASE_URL}/images/${poster}`} alt={title}  className="card-img"/>
                    </div>
                </Link>
                <Card.Body>
                    <Card.Title className="card-title">{ title.length > 23 ? title.substring(0,23).concat('...') : title}</Card.Title>
                    <div className="add-to-fav">
                        {
                            tabName==='favourit' && (
                                <Button className="btn-del" variant="outline-primary" onClick={deleteMovieFromFav}><FontAwesomeIcon icon={faTrash} /> Remove from Favourite</Button>
                            )
                        }
                        {
                            tabName!=='favourit' && (
                                <Button className="btn-fav" variant="outline-primary" onClick={addMovieToFav}><FontAwesomeIcon icon={faHeart} style={{color:'#FF0000'}} /> Add to Favourite</Button>
                            )
                        }
                    </div>                    
                </Card.Body>
            </Card>
        </div>
    );
}

export default MovieListItem;