import React from 'react'
import PropTypes from 'prop-types'
import { Animated, Easing, TouchableWithoutFeedback, View } from 'react-native'

import styles from './styles'

const START = 0
const MID = 1
const MID2 = 2
const MID3 = 3
const END = 4

export default class PulsingCircle extends React.Component {
  state = {
    playAnimation: this.props.playAnimation,
    delay: this.props.delay,
    toggleOnPress: this.props.toggleOnPress ? this.props.toggleOnPress : false
  }

  pulseValue = new Animated.Value(START)

  componentDidMount() {
    if (this.state.playAnimation) this.pulseAnimation()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.playAnimation !== this.props.playAnimation) {
      this.setState({ playAnimation: this.props.playAnimation })

      if (this.props.playAnimation) this.pulseAnimation()
    }

    if (prevProps.delay !== this.props.delay) {
      this.setState({ delay: this.props.delay })
    }

    if (prevProps.toggleOnPress !== this.props.toggleOnPress) {
      this.setState({ toggleOnPress: this.props.toggleOnPress })
    }
  }

  pulseAnimation() {
    this.pulseValue.setValue(START)

    Animated.sequence([
      Animated.timing(this.pulseValue, {
        toValue: MID,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(this.pulseValue, {
        toValue: MID2,
        duration: 10,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.timing(this.pulseValue, {
        toValue: END,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      }),
      Animated.delay(this.state.delay)
    ]).start(() => {
      this.props.onAnimationComplete && this.props.onAnimationComplete()

      if (this.state.playAnimation) this.pulseAnimation()
    })
  }

  startAnimation = () => {
    this.setState({
      playAnimation: true
    })
  }

  stopAnimation = () => {
    this.setState({
      playAnimation: false
    })
  }

  toggleAnimation = () => {
    this.setState({
      playAnimation: !this.state.playAnimation
    })

    if (!this.state.playAnimation) this.pulseAnimation()
  }

  handlePress = () => {
    if (this.state.toggleOnPress) this.toggleAnimation()
    this.props.onPress && this.props.onPress()
  }

  render() {
    const {
      backgroundColor,
      mainCircleBorder,
      mainCircleColor,
      mainCircleSize,
      pulseCircleBorder,
      pulseCircleColor,
      pulseCircleSize
    } = this.props

    return (
      <TouchableWithoutFeedback onPress={() => this.handlePress()}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.circle,
              {
                borderColor: mainCircleColor,
                backgroundColor: backgroundColor,
                borderWidth: mainCircleBorder,
                height: mainCircleSize,
                width: mainCircleSize,
                borderRadius: mainCircleSize / 2
              },
              {
                transform: [
                  {
                    scale: this.pulseValue.interpolate({
                      inputRange: [START, MID, END],
                      outputRange: [1, 0.98, 1]
                    })
                  }
                ]
              }
            ]}
          />
          <Animated.View
            style={[
              styles.circle,
              styles.circleAbs,
              {
                borderColor: pulseCircleColor,
                borderWidth: pulseCircleBorder,
                height: pulseCircleSize,
                width: pulseCircleSize,
                borderRadius: pulseCircleSize / 2
              },
              {
                transform: [
                  {
                    scale: this.pulseValue.interpolate({
                      inputRange: [START, MID, MID2, END],
                      outputRange: [1, 1, 1, 1.6]
                    })
                  }
                ],
                opacity: this.pulseValue.interpolate({
                  inputRange: [START, MID, MID2, MID3, END],
                  outputRange: [0, 0, 0, 1, 0]
                })
              }
            ]}
          />
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

PulsingCircle.propTypes = {
  delay: PropTypes.number,
  backgroundColor: PropTypes.string,
  mainCircleBorder: PropTypes.number,
  mainCircleColor: PropTypes.string,
  mainCircleSize: PropTypes.number,
  pulseCircleBorder: PropTypes.number,
  pulseCircleColor: PropTypes.string,
  pulseCircleSize: PropTypes.number,
  playAnimation: PropTypes.bool,
  toggleOnPress: PropTypes.bool,
  onPress: PropTypes.func
}

PulsingCircle.defaultProps = {
  delay: 3000,
  backgroundColor: 'transparent',
  mainCircleBorder: 1,
  mainCircleColor: '#6cdbd2',
  mainCircleSize: 200,
  pulseCircleBorder: 1,
  pulseCircleColor: '#6cdbd2',
  pulseCircleSize: 200,
  playAnimation: true,
  toggleOnPress: false
}
