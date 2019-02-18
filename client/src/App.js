import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
      result: [],
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const imageFile = event.target.files[0];
    this.setState({
      file: imageFile,
      imageURL: URL.createObjectURL(imageFile)
    })
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    this.setState({result: ['Loading...']})

    const data = new FormData();
    data.append('file', this.state.file);
    fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ 
          result: body.result
        });
        alert(body.result);
      });
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input onChange={this.handleChange} type="file" />
          </div>
          <br />
          <div>
            <button>Upload</button>
          </div>
          <img src={this.state.imageURL} alt="img" height="300" width="300"/>
        </form>
      </div>
    );
  }
}

export default App;
