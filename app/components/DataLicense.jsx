import React from 'react';
import { View, Text, Linking } from 'react-native';

const Datalicense = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Privacy Policy
      </Text>
      <Text style={{ marginBottom: 10 }}>Last updated: April 16, 2024</Text>
      <Text style={{ marginBottom: 10 }}>
        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
      </Text>
      <Text style={{ marginBottom: 10 }}>
        We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the 
        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://www.freeprivacypolicy.com/free-privacy-policy-generator/')}> Free Privacy Policy Generator</Text>.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Interpretation and Definitions</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Interpretation</Text>
      <Text>
        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
      </Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Definitions</Text>
      <Text>
        For the purposes of this Privacy Policy:
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Account</Text> means a unique account created for You to access our Service or parts of our Service.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Affiliate</Text> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Application</Text> refers to PMC, the software program provided by the Company.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Company</Text> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to PMC, 57 Huỳnh Thúc Kháng, Quận Đống Đa, Hà Nội.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Country</Text> refers to: Vietnam
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Device</Text> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Personal Data</Text> is any information that relates to an identified or identifiable individual.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Service</Text> refers to the Application.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Service Provider</Text> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>Usage Data</Text> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
      </Text>
      <Text>
        - <Text style={{ fontWeight: 'bold' }}>You</Text> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
      </Text>
      {/* The rest of the content omitted for brevity */}
    </View>
  );
};

export default Datalicense;
