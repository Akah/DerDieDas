import * as React from 'react';
import { ColorValue, StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle, useWindowDimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Noun } from '../db';
import { getArticle, getGender } from './SearchScreen';

const colors = {
    black: {
        background: '#222222',
        border: '#000000',
    },
    red: {
        background: '#DD0000',
        border: '#AA0000',
    },
    gold: {
        background: '#FFCC00',
        border: '#CC9900',
    },
};

function useStyles() {
    return StyleSheet.create({
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
        },
        container: {
            flexDirection: 'row',
            position: 'absolute',
            bottom: 16,
            width: '100%',
        },
        button: {
            width: '33.3%',
        },
    });
}

type Position = 'left' | 'right' | 'bottom' | 'top';

const useButtonStyles = (position: Position | undefined, color: ColorValue, borderColor: ColorValue) => {
    const borderRadius: number = 16;
    return StyleSheet.create({
        border: {
            borderWidth: 4,
            borderColor: borderColor,
            borderBottomWidth: 8, 
            borderTopLeftRadius: position === 'left' || position === 'top' ? borderRadius : 0,
            borderTopRightRadius: position === 'right' || position === 'top' ? borderRadius : 0,
            borderBottomLeftRadius: position === 'left' || position === 'bottom' ? borderRadius : 0,
            borderBottomRightRadius: position === 'right' || position === 'bottom' ? borderRadius : 0,
        },
        button: {
            flex: 1,
            backgroundColor: color,
        },
        text: {
            color: 'white',
            textShadowOffset: {
                width: 0,
                height: 2,
            },
            textShadowRadius: 2,
        },
    });
};

interface ButtonProps extends React.PropsWithChildren {
    onPress: () => void;
    position?: Position;
    color: ColorValue;
    borderColor: ColorValue;
    style?: ViewStyle;
    textStyles?: TextStyle;
}

export const MyButton: React.FC<ButtonProps> = (props: ButtonProps) => {
    const styles = useButtonStyles(props.position, props.color, props.borderColor);
    const [ pressed, setPressed ] = React.useState<boolean>(false);

    const onPressIn = () => setPressed(true);
    const onPressOut = () => setPressed(false);
    
    return (
        <View style={[props.style, pressed? { marginTop: 4 } : undefined]}>
            <Button
                style={[
                    styles.button,
                    styles.border,
                    pressed ? { borderBottomWidth: 4 } : undefined,
                ]}
                uppercase={true}
                onPress={props.onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Text style={[styles.text, props.textStyles]}>
                    {props.children}
                </Text>
            </Button>
        </View>
    );
};

const useProgressStyles = (percent: number) => {
    const size = 20;
    return StyleSheet.create({
        container: {
            flex: 1,
            height: size,
            backgroundColor: 'lightgrey',
            borderRadius: 16,
        },
        progress: {
            width: `${percent}%`,
            height: size,
            backgroundColor: '#64DD17',
            borderRadius: 16,
            alignItems: 'center',
            flex: 1,
        },
        light: {
            flex: 1,
            height: size / 4,
            backgroundColor: '#76FF03',
            borderRadius: 4,
            marginTop: 4,
        },
    });
}

interface ProgressProps {
    percent: number;
    style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = (props: ProgressProps) => {
    const styles = useProgressStyles(props.percent);
    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.progress}>
                <View style={styles.light} />
            </View>
        </View>
    );
};

const useSurfaceStyles = () => {
    return StyleSheet.create({
        surface: {
            padding: 16,
            borderRadius: 16,
            borderColor: 'lightgrey',
            borderWidth: 4,
        }
    });
};

export const Surface: React.FC<ViewProps> = (props) => {
    const styles = useSurfaceStyles();
    return (
        <View style={[styles.surface, props.style]}>
            {props.children}
        </View>
    );
};

interface QuizSurfaceProps {
    favorite: boolean;
    noun: Noun;
    resolved: boolean;
}

export const QuizSurface: React.FC<QuizSurfaceProps> = (props) => {
    const [ favorite, setFavorite ] = React.useState<boolean>(props.favorite);
    const article = props.resolved ? '___' : getArticle(getGender(props.noun));
    return (
        <Surface style={{ width: '100%'}}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '900' }}>{article + ' ' + props.noun.noun}</Text>
                <IconButton
                    onPress={() => setFavorite(!favorite)}
                    icon={favorite ? 'heart' : 'heart-outline'}
                    style={{ margin: 0, marginRight: -10 }}
                    iconColor={favorite ? colors.red.background : 'grey'}
                    size={25}
                />
            </View>
            <Text style={{alignSelf: 'flex-end'}}>{'frequency: ' + props.noun.frequency}</Text>
        </Surface>
    );
}

export const HomeScreen: React.FC = () => {
    const styles = useStyles();
    const [ resolved, setResolved ] = React.useState<boolean>(false);
    const [ progress, setProgress ] = React.useState<number>(10);

    const foo = () => { setResolved(!resolved)};

    const upProgress = () => {
        if (progress < 100) {
            setProgress(progress + 10);
        }
    };

    const pressDer = () => {
        upProgress();
        setResolved(!resolved);
        console.debug('clicked', progress, resolved);
    };
    const pressDie = () => {
        upProgress();
        setResolved(!resolved);
        console.debug('clicked', progress, resolved);
    };
    const pressDas = () => {
        upProgress();
        setResolved(!resolved);
        console.debug('clicked', progress, resolved);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <View style={styles.header}>
                <IconButton icon="window-close" style={{ marginLeft: 0 }} onPress={() => setProgress(10)} />
                <Progress percent={progress} />
            </View>
            <QuizSurface
                favorite={false}
                noun={{ index: 1, noun: 'Wurst', gender: 'f', gender2: null, gender3: null, frequency: 465 }}
                resolved={resolved}
            />
            <View style={styles.container}>
                <MyButton
                    position="left"
                    style={styles.button}
                    onPress={pressDer}
                    color={colors.black.background}
                    borderColor={colors.black.border}
                >
                    Der
                </MyButton>
                <MyButton
                    style={styles.button}
                    onPress={pressDie}
                    color={colors.red.background}
                    borderColor={colors.red.border}
                >
                    Die
                </MyButton>
                <MyButton
                    style={styles.button}
                    position="right"
                    onPress={pressDas}
                    color={colors.gold.background}
                    borderColor={colors.gold.border}
                >
                    Das
                </MyButton>
            </View>
        </View>
    );
};
