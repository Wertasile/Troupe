import React, { useEffect, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';


AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
});

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [imageUrls, setImageUrls] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [fileUrls, setFileUrls] = useState({});

  // FOR IMAGES

  const getImage = async (filename) => {
    try {
      const s3 = new S3({
        params: { Bucket: "discourse-image-bucket" },
        region: "us-east-1",
      });

      const url = s3.getSignedUrl('getObject', {
        Bucket: "discourse-image-bucket",
        Key: filename,
      });

      return url;
    } catch (error) {
      console.error("Error getting signed URL", error);
      return null;
    }
  };

  const fetchImageUrls = async () => {
    const newImageUrls = {};
    for (const message of messages) {
      if (message.messagetype === "image" && message.content && !newImageUrls[message._id]) {
        const url = await getImage(message.content);
        console.log("Image URL IS " + url)
        if (url) {
          newImageUrls[message._id] = url;
        }
      }
    }
    setImageUrls(newImageUrls);
    console.log("ImageUrls FINAL;");
    console.log(imageUrls);
  };

  // FOR AUDIO mp3

  const getAudio = async (filename) => {
    try {

      const s3 = new S3({
        params: { Bucket: "discourse-voice-bucket" },
        region: "us-east-1",
      });

      const url = s3.getSignedUrl('getObject', {
        Bucket: "discourse-voice-bucket",
        Key: filename,
      });

      return url;
    } catch (error) {
      console.error("Error getting signed URL", error);
      return null;
    }
  };

  const fetchAudioUrls = async () => {
    const newAudioUrls = {};
    for (const message of messages) {
      if (message.messagetype === "audio" && message.content && !newAudioUrls[message._id]) {
        const url = await getAudio(message.content);
        
        if (url) {
          newAudioUrls[message._id] = url;
          console.log("Audio URL IS " + newAudioUrls[message._id])
        }
      }
    }
    setAudioUrls(newAudioUrls); // Merge previous state with new URLs
    console.log("audioUrls FINAL;");
    console.log(audioUrls);
  };

  // FOR FILES

  const getFile = async (filename) => {
    try {
      const s3 = new S3({
        params: { Bucket: "discourse-file-bucket" },
        region: "us-east-1",
      });

      const url = s3.getSignedUrl('getObject', {
        Bucket: "discourse-file-bucket",
        Key: filename,
      });

      return url;
    } catch (error) {
      console.error("Error getting signed URL", error);
      return null;
    }
  };

  const fetchFileUrls = async () => {
    const newFileUrls = {};
    for (const message of messages) {
      if (message.messagetype === "file" && message.content && !newFileUrls[message._id]) {
        const url = await getFile(message.content);
        console.log("File URL IS " + url)
        if (url) {
          newFileUrls[message._id] = url;
        }
      }
    }
    setFileUrls(newFileUrls);
    console.log("FileUrls FINAL;");
    console.log(fileUrls);
  };

  useEffect(() => {
    fetchFileUrls();
    fetchAudioUrls();
    fetchImageUrls();
  }, [messages]);



  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div className="scrollable-chat" style={{ display: "flex" }} key={m._id}>
          {
            ((isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) &&
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />
              </Tooltip>
            )
          }

          <span className="messages" style={{
            backgroundColor: `${m.sender._id === user._id ? "#B3E3F8" : "#B9F5D0"}`,
            marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10
          }}>
            {
              (() => {
                switch (m.messagetype) {
                  case "image":
                    return <img src={imageUrls[m._id]} width="200" height="100" alt="Message content" />
                  case "audio":
                    return <audio controls src={audioUrls[m._id]} type="audio/mp3"></audio>
                  case "file" :
                    // return <embed data={fileUrls[m._id]} type="application/pdf" width="100%" height="600px">
                    return <div className='file-download'>
                            <a href={fileUrls[m._id]}>{m.content}<i style={{fontSize:24, paddingLeft:9}} class="fa-solid fa-circle-arrow-down"></i></a>
                          </div>
                    
                  default:
                    return <>{m.content}</>
                }
              })
            ()}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
