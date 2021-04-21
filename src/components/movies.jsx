import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBar from "./common/searchBar";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    search: "",
  };

  async componentDidMount() {
    const { data: genresDB } = await getGenres();
    const genres = [{ name: "All Genres" }, ...genresDB];
    const { data: movies } = await getMovies();

    this.setState({ movies: movies, genres: genres });
  }

  handleLike = (movie) => {
    console.log(`movie: ${movie.title} heart clicked`);
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movie };
    movies[index].liked = !movies[index].liked; //true->false, false->true
    this.setState({
      movies,
    });
  };

  handleDelete = async (movie) => {
    const original = this.state.movies;
    this.setState({
      movies: original.filter((m) => movie._id !== m._id),
    });
    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        //如果delete不成功server會回傳404
        toast.error("The movie has been deleted.");

      this.setState({ movies: original });
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, search: "" });
  };

  handleSort = (sortColumn) => {
    this.setState({
      sortColumn,
    });
  };

  handleSearchChange = ({ currentTarget: input }) => {
    this.setState({
      search: input.value,
      selectedGenre: null,
      currentPage: 1,
    });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      movies,
      sortColumn,
      search,
    } = this.state;

    let filtered = movies;
    if (search) {
      filtered = movies.filter((movie) =>
        movie.title.toLowerCase().startsWith(search.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre._id) {
      filtered = movies.filter(
        (movie) => movie.genre._id === selectedGenre._id
      ); //._id不存在表示選中All Genres標籤
    }
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]); //lodash.orderBy會回傳新的array
    const allMovies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: allMovies };
  };

  render() {
    const { length: count } = this.state.movies; //把length存入count變數
    const {
      pageSize,
      currentPage,
      genres,
      selectedGenre,
      sortColumn,
    } = this.state;

    if (count === 0) return <h2>資料庫裏一部電影都沒有喔！</h2>;
    const { totalCount, data } = this.getPagedData();
    const { user } = this.props;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link to="/movies/new" className="btn btn-primary mb-3">
              新增
            </Link>
          )}
          <h4>{totalCount}部電影在資料庫中</h4>
          <SearchBar
            value={this.state.search}
            onChange={this.handleSearchChange}
          />
          <MoviesTable
            movies={data}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
