import './SearchBar.css';
import React from "react";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ''}
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.onChangeTrigger = this.onChangeTrigger.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term)
  }

  handleTermChange(event) {
    this.setState({term: event.target.value})
  }

  onChangeTrigger(event) {
    this.setState({term: event.target.value})
    this.props.onSearch(this.state.term);
  }
  
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="What you are looking for?" onChange={this.onChangeTrigger} />
        <button className="SearchButton"  onClick={this.search} >SEARCH</button>
      </div>
    )
  }
}