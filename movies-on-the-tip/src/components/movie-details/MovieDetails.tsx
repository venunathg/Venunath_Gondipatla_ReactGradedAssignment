import { useEffect, useState } from "react";
import { Alert, Badge, Col, Container, Modal, Row } from "react-bootstrap";
import IMovie from "../../models/IMovie";
import { LoadingStatus } from "../../models/types";
import LoadingIndicator from "../common/LoadingIndicator";
import { faImdb } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMovieDetailsByID, getMovieDetailsByTitleAndYear } from "../../services/Movie";
import { Link, useLocation, useParams } from "react-router-dom";
import { faChartLine, faClock, faCalendarDays, faFilm, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

type Props = {

};


const MovieDetails = ( props : Props ) => {
    const [ status, setStatus] = useState<LoadingStatus>( 'LOADING' );
    const [ movie, setMovie] = useState<IMovie | null>( null );
    const [ error, setError] = useState<Error | null>( null );

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const param = useParams();
    const info : any = useLocation().state;

    useEffect( 
        () => {
        const fetchMovie = async () => {
            
            try {

                if (info.data.id) {
                    const data = await getMovieDetailsByID(info.data.currentTab, info.data.id);
                    setMovie(data);
                } else {
                    const data = await getMovieDetailsByTitleAndYear(info.data.currentTab, param.title as string, info.data.releasedYear); 
                    setMovie( data[0] );
                }                
                setStatus( 'LOADED' );
            } catch (error) {
                setError( error as Error );
                setStatus( 'ERROR_LOADING');
            }
            
        };

        fetchMovie();
    }, [info.data.currentTab, info.data.id, info.data.releasedYear, param.title] );

    let el;

    switch ( status ) {
        case 'LOADING':
            el = (
                <LoadingIndicator 
                    size="large"
                    message="We are fetching the details of the movie. Please wait..." />
            );
            break;
        case 'LOADED':
            const {
                title,
                year,
                genres,
                poster,
                contentRating,
                duration,
                releaseDate,
                averageRating,
                storyline,
                actors,
                imdbRating,
            } = movie as IMovie;
            el = (
                <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="custom-model-header"></Modal.Header>
                    <Modal.Body className="custom-model-body">
                        <img 
                            src={`${process.env.REACT_APP_BASE_URL}/images/${poster}`} 
                            alt="{title}" 
                            className="w-100 custom-modal-image"
                        />
                    </Modal.Body>
                </Modal>
                <div className="back-menu">
                    <Link to="/" className="back-home"><FontAwesomeIcon icon={faAngleLeft}/> Back to Home</Link>
                </div>
                <div className="content-container">
                <Container>
                    <hr className="hr-movie-details"/>
                    <Row>
                        <Col xs={12} lg={5}>
                                <img 
                                    src={`${process.env.REACT_APP_BASE_URL}/images/${poster}`} 
                                    alt={title} 
                                    className="img-container"
                                    onClick={handleShow}
                                />
                        </Col>
                        <Col xs={12} lg={7}>
                            <Row>
                                <Col xs={12}>
                                    <h1><span className="movieTitle">{title}</span> <span className="movieYear">({year})</span></h1>
                                    <hr className="hr-movie-details"/>
                                </Col>
                            </Row>
                            {
                                imdbRating && (
                                    <Row  className="otherDetails">
                                        <Col xs={4}>
                                            <FontAwesomeIcon icon={faImdb} style={{color:'#F5C518'}}/> <span className="otherDetailsTitle">Imdb Rating</span>
                                        </Col>
                                        <Col xs={8}>{imdbRating}/10</Col>
                                    </Row>
                                )
                            }
                            {
                                contentRating && (
                                    <Row  className="otherDetails">
                                        <Col xs={4}>
                                            <FontAwesomeIcon icon={faFilm} style={{color:'#141414'}}/> <span className="otherDetailsTitle">Content Rating</span>
                                        </Col>
                                        <Col xs={8}>{contentRating}</Col>
                                    </Row>
                                )
                            }
                            {
                                averageRating>=0 && (
                                    <Row  className="otherDetails">
                                        <Col xs={4}>
                                            <FontAwesomeIcon icon={faChartLine} style={{color:'#7CBB62'}}/> <span className="otherDetailsTitle">Average Rating</span>
                                        </Col>
                                        <Col xs={8}>{averageRating}</Col>
                                    </Row>
                                )
                            }
                            {
                                duration && (
                                    <Row  className="otherDetails">
                                        <Col xs={4}>
                                            <FontAwesomeIcon icon={faClock} style={{color:'#5BAAEF'}}/> <span className="otherDetailsTitle">Duration</span>
                                        </Col>
                                        <Col xs={8}>{Math.floor(Number(duration.replace("PT","").replace("M",""))/60)}h {Number(duration.replace("PT","").replace("M",""))%60}m</Col>
                                    </Row>
                                )
                            }
                            {
                                releaseDate && (
                                    <Row  className="otherDetails">
                                        <Col xs={4}>
                                            <FontAwesomeIcon icon={faCalendarDays} style={{color:'#2B4162'}}/> <span className="otherDetailsTitle">Release Date</span>
                                        </Col>
                                        <Col xs={8}>{releaseDate}</Col>
                                    </Row>
                                )
                            }
                        </Col>
                    </Row>
                    <hr className="hr-movie-details"/>
                    <div>
                        <div className="detailsTitle">Genres</div>
                        <div>
                            {
                                genres.map(
                                    genre => (
                                        <Badge pill bg="primary" className="badge" key={genre}>{genre}</Badge>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <hr className="hr-movie-details"/>
                    <div>
                        <div className="detailsTitle">Stars</div>
                        <div>
                            {
                                actors.map(
                                    actor => (
                                        <Badge bg="secondary" className="badge" key={actor}>{actor}</Badge>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <hr className="hr-movie-details"/>
                    <div>
                        <div className="detailsTitle">Storyline</div>
                        <div className="story">{storyline}</div>
                    </div>
                    <hr className="hr-movie-details"/>
                </Container>
                </div>
                </>
            );
            break;
        case 'ERROR_LOADING':
            el = (
                <Alert variant="danger">
                    {error?.message}
                </Alert>
            );
            break;
    }

    return el;
}

export default MovieDetails;