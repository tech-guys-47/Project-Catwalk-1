/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import Rating from '@mui/material/Rating';
import { Link } from 'react-scroll';

class ProductStyle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStyle: this.props.style.results[0],
      selectSize: 'Select Size',
      selectQuantity: 'QTY',
      style_id: this.props.style.results[0].style_id,
    };

    this.didUpdate = false;

    this.selectStyle = this.selectStyle.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.className]: e.target.value,
    });
  }

  selectStyle(info) {
    this.setState({
      currentStyle: info,
      selectSize: 'Select Size',
      selectQuantity: 'QTY',
      style_id: info.style_id,
    });
    this.props.setCurrentStyle(info);
  }

  render() {
    let currentRating = 0;
    this.props.currentReviews.results.map((item) => currentRating = item.rating + currentRating);
    currentRating /= this.props.currentReviews.count;
    // console.log('currentRating', currentRating);
    return (
      <div className="productStyle">
        <div className="textPart">
          <div className="review">
            <Rating name="read-only" value={currentRating} precision={0.25} size="small" readOnly />
            <div style={{ cursor: 'pointer' }}>
              <Link to="Reviews" spy smooth>
                Read all
                {' '}
                {this.props.currentReviews.results.length}
                {' '}
                reviews
              </Link>

            </div>
          </div>
          <div className="smallfonts">{this.props.product.category}</div>
          <div className="productName">{this.props.product.name}</div>
          <div className="smallfonts">
            $
            {this.props.product.default_price}
          </div>
        </div>
        <div className="styleOptionsWrapper">
          <div className="styleOptionTitle">STYLES &gt; SELECTED STYLE</div>
          <div className="styleOptions">
            {this.props.style.results.map((result, index) => (
              <Img
                src={result.photos[0].thumbnail_url}
                key={index}
                onClick={this.selectStyle}
                info={result}
                state={this.state}
              />
            ))}
          </div>
        </div>
        <div className="buttons">
          <SelectSize
            currentStyle={this.state.currentStyle}
            onChange={this.handleChange}
            state={this.state}
          />
          <button type="button" className="cartButton">Add to Cart</button>
          <button type="button" className="star">&#9734;</button>
        </div>
      </div>

    );
  }
}
const Img = (props) => {
  let currentClass = 'styleOption';
  if (props.info.style_id === props.state.style_id) {
    currentClass = 'selectedOption'; // change selectedOptions style in css
  }
  return (
    <div
      onClick={() => { props.onClick(props.info); }}
      className={currentClass}
    >
      <img src={props.src} alt="first thumbnail" />
    </div>
  );
};

const SelectSize = (props) => {
  const currentSize = props.currentStyle.skus;
  return (
    <div className="selectSizeDiv">
      <div>
        <select className="selectSize" onChange={props.onChange} value={props.state.selectSize}>
          <option>Select Size</option>
          {Object.values(currentSize).map((item, index) => (
            <option
              value={item.size}
              key={index}
            >
              {item.size}
            </option>
          ))}
        </select>
      </div>
      <SelectQuantity currentSize={currentSize} onChange={props.onChange} state={props.state} />
    </div>
  );
};

const SelectQuantity = (props) => {
  const { currentSize, state } = props;
  let quantity = 0;
  const obj = Object.values(currentSize).filter((item) => item.size === state.selectSize);
  if (obj.length === 0) quantity = 0;
  else quantity = obj[0].quantity;
  const arr = Array(quantity);
  arr.fill(0, 0);
  return (
    <div>
      <select className="selectQuantity" onChange={props.onChange} value={props.state.selectQuantity}>
        <option>QTY</option>
        {arr.map((item, index) => (
          <option key={index}>
            {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductStyle;