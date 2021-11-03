import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import axios from 'axios';

export default class Discover extends Component {
  
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  componentDidMount(){
  
    const country = 'MX';
    const offset= 1;
    const limit = 20;
    const locale = "sv_MX";
    const timestamp = "2021-10-23T09%3A00%3A00.000Z";
    /* get token for spotify api */
    axios('https://accounts.spotify.com/api/token', {
			'method': 'POST',
			'headers': {
				 'Content-Type':'application/x-www-form-urlencoded',
				 'Authorization': 'Basic ' + (new Buffer( process.env.REACT_APP_SPOTIFY_CLIENT_ID + ':' + process.env.REACT_APP_SPOTIFY_CLIENT_SECRET).toString('base64')),
			},
			data: 'grant_type=client_credentials'
		}).then(tokenresponse => {
      if(tokenresponse.request.status === 200){
        /* get new releases */
        axios(`https://api.spotify.com/v1/browse/new-releases?country=${country}&offset=${offset}&limit=${limit}`,{
          'method': 'GET',
          'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenresponse.data.access_token
          }
        }).then(trackresponse=> {
          if(trackresponse.request.status === 200){
            const tracks = trackresponse.data.albums.items;
            this.setState({newReleases: tracks });
          }
        }).catch(error=> console.log(error));

        /* get featured playlist */
        axios(`https://api.spotify.com/v1/browse/featured-playlists?country=${country}&locale=${locale}&timestamp=${timestamp}&limit=${limit}&offset=${offset}`,{
          'method': 'GET',
          'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenresponse.data.access_token
          }
        }).then(trackresponse=> {
          if(trackresponse.request.status === 200){
            const playlistsItems = trackresponse.data.playlists.items;
            this.setState({playlists: playlistsItems });
          }
        }).catch(error=> console.log(error));

        /* get categories */
        axios(`https://api.spotify.com/v1/browse/categories?country=${country}&locale=${locale}&timestamp=${timestamp}&limit=${limit}&offset=${offset}`,{
          'method': 'GET',
          'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenresponse.data.access_token
          }
        }).then(trackresponse=> {
          if(trackresponse.request.status === 200){
            const categoriesItems = trackresponse.data.categories.items;
            this.setState({categories: categoriesItems });
          }
        }).catch(error=> console.log(error));
      }
		}).catch(error => console.log(error));
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
