import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import { DBProvider } from './DBProvider';
import { PaperProvider } from 'react-native-paper';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';

const paperSettings: Settings = {
    rippleEffectEnabled: false,
};

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <PaperProvider settings={paperSettings}>
                <DBProvider>
                    <AppNavigator />
                </DBProvider>
            </PaperProvider>
        </NavigationContainer>
    );
}

export default App;
