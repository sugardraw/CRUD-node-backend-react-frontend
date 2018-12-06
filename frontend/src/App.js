import React, { Component } from "react";
import axios from "axios";
import "./index.css";
import uuid from "uuid";

class App extends Component {
  constructor() {
    super();

    this.axiosConfig = {
      headers: { "Access-Control-Allow-Origin": "*" }
    };

    this.state = {
      incomingPosts: "",
      title: "",
      body: "",
      id: ""
    };
    this.activate = false;
  }
  // componentDidUpdate() {
  //   axios
  //     .get("http://127.0.0.1:3001/api/notes/list", this.axiosConfig)
  //     .then(posts => {
  //       this.setState({
  //         incomingPosts: posts.data
  //       });
  //       console.log(posts);
  //     });
  // }
  componentDidMount() {
    axios
      .get("http://127.0.0.1:3001/api/notes/list", this.axiosConfig)
      .then(posts => {
        this.setState({
          incomingPosts: posts.data
        });
        console.log(posts);
      });
  }

  /**
   * add a post
   *
   */

  getPostValues = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      id: uuid()
    });
  };

  submit = e => {
    e.preventDefault();
    axios
      .post(
        `http://127.0.0.1:3001/api/notes/add?title=${this.state.title}&body=${
          this.state.body
        }&id=${this.state.id}`,
        {
          params: {
            title: this.state.title,
            body: this.state.body,
            id: this.state.id
          }
        }
      )
      .then(posts => {
        this.setState({
          incomingPosts: posts.data
        });
        console.log(posts);
      })
      .then(data => console.log(data));

    e.currentTarget.reset();
  };

  /**
   * remove posts
   *
   */

  handleRemove = e => {
    var regex = /^[^:]+/;
    const titleValue = e.target.parentNode.textContent.match(regex);
    console.log(e.target.parentNode.textContent, titleValue[0]);

    this.delete(titleValue[0]);
  };

  delete = title => {
    axios
      .post(`http://127.0.0.1:3001/api/notes/delete?title=${title}`)
      .then(posts => {
        this.setState({
          incomingPosts: posts.data
        });
        console.log(posts);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /**
   * edit posts and update
   *
   */

  showEditForm = e => {
    console.log(e);
    this.activate = true;

    const { title, body, id } = e.target.dataset;

    this.setState({
      title: title,
      body: body,
      id: id
    });
  };

  getPostValuesEdit = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  submitEdit = e => {
    e.preventDefault();
    console.log("submitting", this.state.title, this.state.body, this.state.id);

    axios
      .put(
        `http://127.0.0.1:3001/api/notes/update?title=${
          this.state.title
        }&body=${this.state.body}&id=${this.state.id}`,
        {
          params: {
            title: this.state.title,
            body: this.state.body
          }
        }
      )
      .then(posts => {
        this.setState({
          incomingPosts: posts.data
        });
        console.log(posts);
      })
      .then((this.activate = false));
  };

  render() {
    let results = () => {
      let data = [];
      for (let elem in this.state.incomingPosts.data) {
        data.push(
          <li className="list">
            <h2>{this.state.incomingPosts.data[elem].title}: </h2>
            <div className="post-body">
              {this.state.incomingPosts.data[elem].body}
            </div>
            <div className="buttons">
              <button
                type="submit"
                name="delete"
                htmlFor="delete"
                onClick={this.handleRemove}
              >
                X
              </button>
              <button
                type="submit"
                name="edit"
                htmlFor="edit"
                data-title={this.state.incomingPosts.data[elem].title}
                data-body={this.state.incomingPosts.data[elem].body}
                data-id={this.state.incomingPosts.data[elem].id}
                onClick={this.showEditForm}
              >
                Edit Post
              </button>
            </div>
          </li>
        );
      }
      return data;
    };

    return (
      <div className="app">
        <form
          action="/api/notes/"
          className="form-notes"
          method="POST"
          onSubmit={this.submit}
        >
          <h3>POSTS</h3>
          <label htmlFor="title" className="labels">
            TITLE
          </label>
          <input type="text" name="title" onChange={this.getPostValues} />
          <label htmlFor="body" className="labels">
            BODY
          </label>
          <input type="text" name="body" onChange={this.getPostValues} />
          <input type="submit" value="submit" />
        </form>

        <ul className="list">
          {results().map(item => (
            <div>{item}</div>
          ))}
        </ul>

        {this.activate ? (
          <div className="edit-form">
            <form
              action="/api/put/"
              className=""
              method="PUT"
              onSubmit={this.submitEdit}
            >
              <h3>EDIT POST ID: {this.state.id}</h3>
              <label htmlFor="title" className="labels">
                TITLE
              </label>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={this.getPostValuesEdit}
              />
              <label htmlFor="body" className="labels">
                BODY
              </label>
              <input
                type="text"
                value={this.state.body}
                name="body"
                onChange={this.getPostValuesEdit}
              />
              <input type="submit" value="submit" />
            </form>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
