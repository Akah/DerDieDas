import React from 'react';
import { Text, ScrollView, View, Linking } from 'react-native';
import { IconButton, Searchbar } from 'react-native-paper';
import { Gender, Noun, useDictionary } from '../db';
import { useDBContext } from '../DBProvider';

export function getGender(noun: Noun): Gender | null {
    if (noun.gender != null) {
        return noun.gender;
    } else if (noun.gender2 != null) {
        return noun.gender2;
    }
    return noun.gender3;
}

export function genderToString(gender: Gender | null): string {
    switch (gender) {
        case 'f':
            return 'feminine';
        case 'n':
            return 'neuter';
        case 'm':
            return 'masculine';
        default:
            return 'not specified';
    }
}

export function getArticle(gender: Gender | null): string {
    switch (gender) {
        case 'f':
            return 'die';
        case 'n':
            return 'das';
        case 'm':
            return 'der';
        default:
            return 'n/a';
    }
}

export function frequencyToString(frequency: number | null): string {
    if (frequency == null) {
        return 'n/a';
    }
    return frequency.toString();
}

interface EntryProps {
    word: Noun;
    index: number;
    length: number;
}

const Entry: React.FC<EntryProps> = (props: EntryProps) => {
    const padding = 2;
    const radius = 16;
    const top = props.index === 0;
    const bottom = props.index === props.length - 1;
    const openWeb = (): void =>{
        Linking.openURL(`https://en.wiktionary.org/wiki/${props.word.noun}`);
    };
    return (
        <View style={{
            borderTopLeftRadius: top ? radius : 0,
            borderTopRightRadius: top ? radius : 0,
            borderBottomLeftRadius: bottom ? radius : 0,
            borderBottomRightRadius: bottom ? radius : 0,
            borderWidth: padding,
            borderColor: 'lightgrey',
            marginHorizontal: 16,
            marginBottom: -padding,
            padding: 8,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                    <Text style={{ fontWeight: '900' }}>{props.word.noun}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{}}>
                            {`Gender: ${genderToString(getGender(props.word))}`}
                        </Text>
                        <Text style={{}}>
                            {`Frequency: ${frequencyToString(props.word.frequency)} `}
                        </Text>
                    </View>
                </View>
                <IconButton style={{margin: 0}} icon="search-web" onPress={openWeb} />
            </View>
        </View >
    );
};

export const SearchScreen: React.FC = () => {
    const [ search, setSearch ] = React.useState<string>('');
    const db = useDBContext();
    const dictionary = useDictionary(db!);
    return (
        <ScrollView>
            <Searchbar
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
            />
            <View style={{marginVertical: 16}}>
                {dictionary?.map((word, index) => <Entry word={word} index={index} length={dictionary.length} key={`word-${index}`} />)}
            </View>
        </ScrollView>
    );
};
