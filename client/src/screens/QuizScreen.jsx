import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import {
  useScrollHandler,
  withSpringTransition,
  useValue,
} from 'react-native-redash/lib/module/v1';
import Animated, { multiply, Value, SpringUtils } from 'react-native-reanimated';
import { Box, Text } from '../components/Theme';
import QuestionContainer from '../components/QuestionContainer';
import questions from '../components/data';
import QuestionSlide from '../components/QuestionSlide';
import Answers from '../components/Answers';
import Alert from '../components/Alert';

const { View, ScrollView } = Animated;

const { height, width } = Dimensions.get('window');

const QuizScreen = ({ navigation: { navigate } }) => {
  const { x, scrollHandler } = useScrollHandler();
  const scroll = useRef(null);

  const [allQuestions, setAllQuestions] = useState([]);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [currNum, setCurrNum] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

  const answerSelected = (answer, i) => {
    if (!quizOver) {
      const answerIsCorrect = allQuestions[currNum].correctAnswer === answer;
      if (answerIsCorrect) {
        setScore((currScore) => currScore + 1);
      }

      const currentAnswerObj = {
        question: allQuestions[currNum].question,
        answer,
        answerIsCorrect,
        correctAnswer: allQuestions[currNum].correctAnswer,
      };

      setUserSelectedAnswers((currentAnswers) => [...currentAnswers, currentAnswerObj]);
    }
  };

  const nextQuestion = () => {
    if (!quizOver && currNum < allQuestions.length - 1) {
      setCurrNum((number) => number + 1);
    } else {
      setQuizOver(true);
    }
  };

  useEffect(() => {
    if (!quizOver) {
      if (scroll.current) {
        scroll.current?.getNode().scrollTo({
          x: width * currNum,
          animated: true,
        });
      }
    }
  });

  useEffect(() => {
    if (userSelectedAnswers.length) {
      nextQuestion();
    }
  }, [userSelectedAnswers]);

  useEffect(() => {
    setAllQuestions(questions.sort(() => 0.5 - Math.random()));
  }, []);

  const finishedValue = useValue(0);
  useEffect(() => {
    if (quizOver) {
      finishedValue.setValue(1);
    }
  }, [quizOver]);

  const finished = withSpringTransition(finishedValue, {
    ...SpringUtils.makeDefaultConfig(),
    overshootClamping: true,
    damping: new Value(10),
  });

  return (
    <QuestionContainer>
      <Box style={{ flex: 1 }}>
        <Box flex={1}>
          <Box justifyContent="flex-start" flex={1} flexDirection="column">
            <Box height={verticalScale(height * 0.3)} style={{ backgroundColor: '#2e86ab' }}>
              <ScrollView
                ref={scroll}
                horizontal
                snapToInterval={width}
                decelerationRate="fast"
                bounces={false}
                {...scrollHandler}
              >
                {allQuestions.map(({ question }, i) => (
                  <Fragment key={i}>
                    <QuestionSlide {...{ question, i }} questionNr={currNum + 1} />
                  </Fragment>
                ))}
              </ScrollView>
            </Box>
            <Box
              style={{
                flex: 1,
                height: 0.4 * height,
              }}
            />
          </Box>
          <View
            style={{
              width: width * allQuestions.length,
              flexDirection: 'row',
              transform: [{ translateX: multiply(x, -1) }],
            }}
          >
            {allQuestions.map(({ answers }, i) => (
              <Fragment key={i}>
                <Answers {...{ answers, answerSelected }} />
              </Fragment>
            ))}
          </View>
        </Box>
        <View
          style={{
            width: width * allQuestions.length,
            flexDirection: 'row',
            transform: [{ translateX: multiply(x, -1) }],
            height: 100,
          }}
        >
          {allQuestions.map(({ answers }, i) => {
            const last = i === allQuestions.length - 1;
            return (
              <Fragment key={i}>
                <View style={{ flex: 1, width, justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#2e86ab',
                      width: 150,
                      height: 50,
                      marginLeft: 130,
                      justifyContent: 'center',
                      borderRadius: 15,
                    }}
                    onPress={nextQuestion}
                  >
                    <Text
                      style={{
                        color: 'white',
                        textTransform: 'uppercase',
                        fontSize: 18,
                        textAlign: 'center',
                      }}
                    >
                      {last ? 'submit' : 'next'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Fragment>
            );
          })}
        </View>
        {quizOver && (
          <Alert
            {...{ finished }}
            onRestart={() => {
              finishedValue.setValue(0);
              navigate('Profile');
            }}
            userAnswers={userSelectedAnswers}
          />
        )}
      </Box>
    </QuestionContainer>
  );
};

export default QuizScreen;


