"use strict";
/*global React*/

//inputting things to a user list through a table
var UserTable = React.createClass({
  loadTable: function() {
    $.getJSON('/users/userlist', function(data) {
      this.setState({'data': data});
    }.bind(this) );
  },
  getInitialState: function() {
    return {'data': []};
  },
  componentDidMount: function() {
    this.loadTable();
    setInterval(this.loadTable, 10000);
  },
  handleFormSubmit: function(form) {
    console.log(form);
    $.ajax({
      url: '/users/adduser',
      dataType: 'json',
      type: 'POST',
      data: form,
      success: function(data) {
        return;
      }.bind(this),
      error: function(xhr,status,err) {
        console.error(this.props.url,status,err.toString());
      }.bind(this)
  });
  },
  render: function() {
    var rows = [];
    this.state.data.forEach(function(user) {
      rows.push(<tr>);
      rows.push(<td><a href="#" className="linkshowuser" rel={user.username}>{user.username}</a></td>);
      rows.push(<td>{user.email}</td>);
      rows.push(<td onClick={this.handleDelete} rel={user._id}>delete</td>);
      rows.push(</tr>);
    }.bind(this));
    return (
        <div>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Delete?</th>
                </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
        </table>
        <Form onFormSubmit={this.handleFormSubmit}/>
        </div>
    );
  },
  handleDelete: function(event) {
    event.preventDefault();
    var userId = $(event.target).attr('rel');
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + userId,
      success: function(data) {
        this.setState({'data': _.filter(this.state.data, function(entry) {
          return entry["_id"] != userId;
        })});
      }.bind(this),
      error: function(xhr,status,err) {
        console.error(this.props.url,status,err.toString());
      }.bind(this)
    });
  },
});

var Form = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var username = this.refs.username.getDOMNode().value.trim();
    var email = this.refs.email.getDOMNode().value.trim();
    var fullname = this.refs.fullname.getDOMNode().value.trim();
    var age = this.refs.age.getDOMNode().value.trim();
    var location = this.refs.location.getDOMNode().value.trim();
    var gender = this.refs.gender.getDOMNode().value.trim();
    if (!username && !email && !fullname && !age && !location && !gender)  {
      return;
    }
    // TODO: send request to the server
    this.props.onFormSubmit({'username':username,'email':email,'fullname':fullname,'age':age,'location':location,'gender':gender});
    // resets input values
    this.refs.username.getDOMNode().value = '';
    this.refs.email.getDOMNode().value = '';
    this.refs.fullname.getDOMNode().value = '';
    this.refs.age.getDOMNode().value = '';
    this.refs.location.getDOMNode().value = '';
    this.refs.gender.getDOMNode().value = '';

  },
 render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="username" ref="username" />
        <input type="text" placeholder="email" ref="email" />
        <input type="text" placeholder="full name" ref="fullname" />
        <input type="text" placeholder="age" ref="age" />
        <input type="text" placeholder="location" ref="location" />
        <input type="text" placeholder="gender" ref="gender" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

$(document).ready(function() {
  React.render(
    <UserTable/>,
    $('#userTable')[0]);
});
