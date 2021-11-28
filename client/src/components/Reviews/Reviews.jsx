/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ReviewTile from './ReviewTile';
import MoreReviewBtn from './MoreReviewBtn';
import AddReview from './AddReview';
import Breakdown from './Breakdown';

class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      lessReviews: [],
      // eslint-disable-next-line react/prop-types
      currentID: props.productId,
      moreReview: false,
      moreReviewtext: 'MORE REVIEWS',
      meta: {},
      charItem: {},
      modalShow: false,
      count: 0,
    };
    this.getReviews = this.getReviews.bind(this);
    this.getReviewMeta = this.getReviewMeta.bind(this);
    this.handleMoreReviewsClick = this.handleMoreReviewsClick.bind(this);
    this.handleAddReviewClick = this.handleAddReviewClick.bind(this);
  }

  componentDidMount() {
    this.getReviews();
    this.getReviewMeta();
  }

  componentDidUpdate() {
    const { currentID } = this.state;
    const { productId } = this.props;
    if (currentID !== productId) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        currentID: productId,
      });
      this.getReviews();
      this.getReviewMeta();
    }
  }

  handleMoreReviewsClick() { // get request
    const { moreReview } = this.state;
    if (moreReview === false) {
      this.setState({
        moreReview: true,
        moreReviewtext: 'LESS REVIEWS',
      });
    } else {
      this.setState({
        moreReview: false,
        moreReviewtext: 'MORE REVIEWS',
      });
    }
  }

  handleAddReviewClick(e) {
    this.setState({
      modalShow: e,
    });
  }

  getReviews() {
    const { productId } = this.props;
    axios.get(`/reviews/${productId}`)
      .then((res) => {
        this.setState({
          reviews: res.data.results,
          lessReviews: res.data.results.slice(0, 2),
          count: res.data.results.length,
        });
      })
      .catch((err) => console.log('error', err));
  }

  getReviewMeta() {
    const { productId } = this.props;
    axios.get(`/reviews/meta/${productId}`)
      .then((res) => {
        this.setState({
          meta: res.data,
          charItem: res.data.characteristics,
        });
      })
      .catch((err) => console.log('error', err));
  }

  render() {
    const {
      reviews, lessReviews, currentID, moreReviewtext, moreReview, meta, charItem, modalShow, count,
    } = this.state;
    // default: render 2 review, if more review button is clicked, show all reviews.
    let renderReviews;

    if (moreReview === true) {
      renderReviews = reviews;
    } else {
      renderReviews = lessReviews;
    }

    if (reviews.length === 0) {
      return (
        <div>
          <div> No review available. </div>
          <AddReview currentID={currentID} getReviews={this.getReviews} charItem={charItem} />
        </div>
      );
    }

    return (
      <div id="Review">
        <div className="qTitle" id="Review_title"> RATINGS & REVIEWS </div>
        <div id="Review_left">
          <Breakdown meta={meta} />
        </div>
        <div id="Review_right">
          <div id="Review_sort">
            {`${count} `}
            reviews, sorted by relevance
          </div>
          <div id="Review_tiles">
            {renderReviews.map((review, index) =>
              <ReviewTile review={review} key={index} getReviews={this.getReviews} />)}
          </div>
          <div id="Review_btns">
            <MoreReviewBtn
              reviews={reviews}
              handleMoreReviewsClick={this.handleMoreReviewsClick}
              moreReviewtext={moreReviewtext}
            />
            <Button id="Review_addReviewBtn" onClick={() => this.handleAddReviewClick(true)}>
              ADD A REVIEW +
            </Button>
          </div>
          <AddReview
            show={modalShow}
            onHide={() => this.handleAddReviewClick(false)}
            currentID={currentID}
            getReviews={this.getReviews}
            charItem={charItem}
          />
        </div>
      </div>
    );
  }
}

export default Reviews;