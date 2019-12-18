import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native'
import { colors } from '~/common/constants'

const MenuItem = (props) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 15,
    }}
    disabled={props.disabled}
    onPress={props.onPress}
  >
    <View style={{marginRight: 10, flexDirection: 'row'}}>
      <Image
        source={props.image}
        style={{
          width: 20,
          marginRight: 5,
          marginLeft: 5,
          opacity: props.disabled ? 0.5: 1
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '400',
          color: props.disabled ? '#BFBFC4' : '#36384A',
          paddingLeft: 15
        }}
      >
        {props.title}
      </Text>
    </View>
    <View>
      {props.subtitle &&
        <Text
          style={{
            fontSize: 13,
            fontWeight: '300',
            color: props.disabled ? '#BFBFC4' : '#36384A'
          }}
        >
          {props.subtitle}
        </Text>
      }
    </View>
  </TouchableOpacity>
)

export default MenuItem
