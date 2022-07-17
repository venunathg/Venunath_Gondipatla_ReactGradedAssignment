import { useState } from 'react';
import MoviesList from './movie-list/MoviesList';
import TabOptions from "../utils/TabOptions";




const tabOptions = [
    TabOptions.MOVIES_IN_THEATERS,
    TabOptions.COMING_SOON,
    TabOptions.TOP_RATED_INDIAN,
    TabOptions.TOP_RATED_MOVIES,
    TabOptions.FAVOURITES
]

function Home() {

    const [ tab, setTab ] = useState<TabOptions>( TabOptions.MOVIES_IN_THEATERS );


    return (
        <div>
            <div className="menu-tabs">
            {
                tabOptions.map(
                    tabopts => (
                        <button 
                            key={tabopts}
                            className={`tab-options ${tabopts === tab ? 'tab-option-active' : ''}`}
                            onClick={() => setTab( tabopts )} 
                        >
                            {tabopts}
                        </button>
                    )
                )
            }
            </div>
            <div className='content-container'>
                {
                    tab === TabOptions.MOVIES_IN_THEATERS && <MoviesList tabName='movies-in-theaters' />
                }
                {
                    tab === TabOptions.COMING_SOON && <MoviesList tabName='movies-coming' />
                }
                {
                    tab === TabOptions.TOP_RATED_INDIAN && <MoviesList tabName='top-rated-india' />
                }
                {
                    tab === TabOptions.TOP_RATED_MOVIES && <MoviesList tabName='top-rated-movies' />
                }
                {
                    tab === TabOptions.FAVOURITES && <MoviesList tabName='favourit' />
                }
            </div>
        </div>
    );
}

export default Home;