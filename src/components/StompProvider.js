import React, {useEffect, useState} from "react";
import { Client } from "@stomp/stompjs";
import Lobby from "./Lobby";

const StompProvider = (props) => {

    const [subscriptions, setSubscriptions] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
            console.log('Initialize stomp client...')
            const stompConfig = {
                brokerURL: "ws://localhost:8080/meet",
                debug: function (str) {
                    console.log('STOMP: ' + str);
                },
                reconnectDelay: 10000,
                onConnect: (frame) => {
                    console.log("Entered onconnect")
                    for (const topic of subscriptions) {
                        const topicName = topic.name;
                        console.log("Subscribing to topic ", topicName);
                        // The return object has a method called `unsubscribe`
                        stompClient.subscribe(topicName, topic.onMessage);
                    }
                    setStompClient(stompClient);
                }
            };
            const stompClient = new Client(stompConfig);

            stompClient.onStompError = (frame) => {
                console.error('Stomp error:', frame);
            };
        
            stompClient.onWebSocketError = (event) => {
                console.error('WebSocket error:', event);
            };

            stompClient.onWebSocketClose = (event) => {
                console.error('WebSocket closed:', event);
            };
            
            stompClient.activate();

            // TODO: Implement cleanup function on stomp client, e.g .unsubscribing from subscriptions or closing client
            return () => {
                console.log('Cleanup stomp client...');
                stompClient.deactivate();
            };
        }, []
    );

    function handleSubscription(subscription) {
        console.log('Subscribe to topic: ', subscription);
        stompClient.subscribe(subscription.topic, subscription.onMessage);
        setSubscriptions([...subscriptions]);
    }

    function handlePublishMessage(destination, message) {
        console.log('Publishing message: ', message, 'to destination:', destination);
        stompClient.publish({
                destination: destination,
                body: message
            }
        )
    }

    if (!stompClient) {
        return <h2>Connecting...</h2>;
    }
    const childrenWithProps = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                onSubscribe: (subscription) => handleSubscription(subscription),
                onPublishMessage: (destination, message) => handlePublishMessage(destination, message)
            });
        }
        return child;
    });

    // return <h2>Connected</h2>;

    // return <div>{childrenWithProps}</div>;
    return (
        <Lobby
            onSubscribe={(subscription) => handleSubscription(subscription)}
            onPublishMessage={(destination, message) => handlePublishMessage(destination, message)}
        />
    );

}

export default StompProvider;