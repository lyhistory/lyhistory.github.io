## Basics

In the context of SWIFT, MT stands for Message Type and MX refers to Message XML.

Cross-border payments and reporting plus (CBPR+) is a workgroup of payments experts whose mission is to create global ISO 20022 Market Practice and Implementation Guidelines to ensure a common roll-out and implementation of ISO 20022 by banks.

[ISO 20022 Programme User Handbook - Swift](https://verificationswift.com/swift-resource/252039/swift_iso-20022_programme_uhb_sr2023_final_edition.pdf#/)

### MT (Message Type):

MT messages are part of SWIFT's older format, referred to as the FIN (Financial Information Network) messaging standard. These messages are encoded in a block-based format and are text-based.

The MT format is organized by blocks identified by numbers within {} brackets, where each block has a specific meaning:

+ {1:} is the Basic Header block.
+ {2:} is the Application Header block.
+ {3:} is the User Header block.
+ {4:} is the Text block, containing the actual business message (e.g., details of a transaction).
+ {5:} is the Trailer block.

These blocks contain fields with various tags that specify parts of a message, like sender/receiver information, transaction amounts, and dates.

MT messages are designated by three-digit numbers (e.g., MT103, MT202), each representing a different type of financial message.

**MT type**

Identifying the MT type of a SWIFT FIN message from its content usually relies on information in the Application Header Block ({2:}). Specifically, the message type (MTxxx) is typically in the second block ({2:}). Here’s how it works:

The {2:} block, known as the Application Header Block, contains the MT type in positions 4 to 6.
Example: If {2:} is formatted as {2:I103BANKUS33XXXXN}, the "103" at positions 4 to 6 indicates that this is an MT103 message, which is commonly used for customer payments.
Example Explanation:

A header like {2:I103BANKUS33XXXXN} would indicate:
"I" at the beginning signifies that this is an input message.
"103" specifies the message type, here MT103.
"BANKUS33XXXX" is the BIC (Bank Identifier Code) of the receiving bank.
Common MT Message Types:

Some commonly encountered MT types include:
+ MT103: Customer Transfer
+ MT202: General Financial Institution Transfer 比如用户取款 withdrawal
    Purpose: MT202 is primarily used for bank-to-bank (financial institution) payments. It's a funds transfer instruction from one financial institution to another, usually for settling obligations arising from interbank transactions, such as foreign exchange deals or securities transactions.
    Use Case: When Bank A needs to transfer funds to Bank B, it sends an MT202 message instructing the transfer. This message does not provide detailed information about the underlying reason for the payment, as it’s mainly a payment order without specifying an end-client. 
    ```
    {1:F01BANKXXXXAXXX1234567890}{2:I202BANKYYYYXXXXN}{4:
    :20:TR123456789
    :32A:241118USD100000,
    :52A:BANKAAAA
    :53A:BANKXXXX
    :56A:BANKYYYY
    :58A:BANKZZZZ
    :72:/ACC/BENEFICIARY DETAILS
    -}
    :20: Transaction Reference Number
    :32A: Value Date, Currency Code, and Amount
    :52A: Ordering Institution
    :53A: Sender’s Correspondent
    :56A: Intermediary Institution
    :58A: Beneficiary Institution
    :72: Special Instructions
    This MT202 instructs the transfer of USD 100,000 from the ordering institution to the beneficiary institution.
    ```
+ MT204 (Direct Debit) 比如用户存款 lodge或者margin call
    Purpose: MT204 is specifically for direct debit requests in financial markets. It allows a financial institution to collect funds from another institution, often related to multilateral netting and clearing systems.
    Use Case: For example, in a clearing arrangement, Bank A may owe a net amount to Bank B, and MT204 is used by Bank B to initiate a debit request on Bank A’s account.
    ```
    {1:F01BANKYYYYAXXX1234567890}{2:I204BANKXXXXAXXXN}{4:
    :20:NETDEBIT123
    :21:REF001
    :32A:241118USD25000,
    :53A:BANKAAAA
    :58A:BANKBBBB
    :72:/CLR/NET SETTLEMENT
    -}
    :20: Transaction Reference Number
    :21: Related Reference
    :32A: Value Date, Currency Code, and Amount
    :53A: Sender’s Correspondent
    :58A: Beneficiary Institution (or institution authorizing the debit)
    :72: Special Instructions (like net settlement instructions)
    In this MT204, BANKYYYY requests BANKXXXX to debit BANKAAAA’s account for USD 25,000, which is part of a net settlement in a clearing system.
    ```
+ MT900 (Confirmation of Debit) 
    is sent to confirm the debit on the account. It is not strictly an acknowledgment of MT204, but it often follows it when funds are actually debited in response to such a request.

+ MT910 (Confirmation of Credit) 
    acts similarly for credits, confirming that a credit was applied to an account. It  could be seen as a counterpart if the result of a debit or payment is a credit to another party’s account, possibly following a credit instruction (e.g., from MT103 or MT202 ).

+ MT940: Account Statement
+ MT900/MT910: Debit/Credit Confirmation
+ MT199: Free format message for various purposes

### MX (Message XML):

MX messages, also known as ISO 20022 messages, are XML-based and intended as a modern replacement for the MT format.

MX messages are structured in XML format, providing better interoperability and richer, more detailed data exchange.

Each MX message type is identified by a unique message identifier (e.g., pacs.010.001.03 for a customer credit transfer initiation).

MX messages contain elements and attributes in XML, making them more suitable for complex and structured data exchanges compared to MT.



## Tools
there are several online tools and platforms where you can parse, validate, or interpret SWIFT FIN messages, including MT and ISO 20022 MX message types like pacs.010. Here are some popular options:

1. SWIFT’s MyStandards
Description: SWIFT offers MyStandards, a platform that includes detailed specifications and validation rules for MT and MX messages. You can upload your message and validate it against various SWIFT or CBPR+ guidelines.
Link: MyStandards (requires a SWIFT account).
2. Prowide (formerly WIFE)
Description: Prowide offers a commercial library and an open-source version that allows you to parse and validate SWIFT MT messages as well as MX (ISO 20022) messages. You can try out its capabilities with examples on the Prowide website.
Link: [Prowide Core Examples (tools require setup in a Java environment, but examples are provided).]()
3. DataSmart
Description: DataSmart offers an online MT and MX message parser that can decode message fields into readable formats, including headers, BICs, and structured field data.
Link: DataSmart Parser (has a free version for testing basic parsing).
4. Online ISO 20022 Viewer
Description: Some online viewers specifically cater to ISO 20022 XML messages, allowing you to load and view pacs messages, among others. These viewers often help with XML validation, format checking, and overall readability.
Link: XMLGrid ISO 20022 Viewer (free tool for XML structure viewing).
5. SEPA.eu Parser for ISO 20022
Description: For pacs.008, pacs.009, and pacs.010 messages, SEPA.eu offers a parser specifically for XML formats used in SEPA and ISO 20022 transactions. It validates messages and provides explanations of each segment.
Link: SEPA.eu ISO 20022 Parser (often used for European banking formats, but useful for any pacs messages).
These tools should provide good insights into SWIFT FIN or ISO 20022 messages, allowing for structure validation, parsing, and in some cases, checking message compliance with SWIFT standards.

## SDK
+ OpenSource - Prowide ISO 20022
    [Prowide ISO 20022 API Reference](https://www.javadoc.io/doc/com.prowidesoftware/pw-iso20022/latest/index.html)
    [All Classes](https://javadoc.io/static/com.prowidesoftware/pw-iso20022/SRU2024-10.2.3/allclasses-index.html#/)
+ licensed  - Prowide Integrator

## MsgDefIdr - AbstractMX VS MxPacs VS MxCamt
In the pw-iso20022 library, each model class corresponds to a specific ISO 20022 message type, making it easier to parse, manipulate, and generate XML for these standards. Here's a breakdown of some common classes in this library:

1. AbstractMX
This is a base class for all message-specific classes in Prowide ISO20022, which include all messages under the "MX" family.
Purpose: It provides common functionalities for any ISO 20022 message, regardless of type, like parsing XML into specific message classes or converting message objects back to XML.
Usage: You don’t use AbstractMX directly for a specific message but rather use it when working generically across message types.
2. MxPacs00900109
Message Type: This corresponds to PACS.009.001.09, also known as the "Financial Institution Credit Transfer" message.
Purpose: PACS.009 is used for credit transfers between financial institutions.
Usage: Choose this model when your XML represents a PACS.009 message, typically for credit transfers where a financial institution is the sender and/or receiver.
3. MxCamt05400108
Message Type: This represents CAMT.054.001.08, known as the "Bank-to-Customer Debit/Credit Notification."
Purpose: CAMT.054 messages provide account notifications, such as for debit/credit information, typically to inform account holders about transactions.
Usage: Use this model if your XML message is a CAMT.054 type, often used in scenarios where banks notify customers about account activity.
How to Choose the Right Model
When working with pw-iso20022, the specific message type of the XML will determine the model class you need:

Look for Message Identifiers: Each ISO 20022 XML file typically has a <MsgDefIdr> tag, like <MsgDefIdr>pacs.009.001.09</MsgDefIdr>, which identifies the message type.
Identify the Message Family: If the identifier begins with "pacs," you’ll likely use a MxPacs... class, for "camt," a MxCamt... class, and so forth.
Choose Based on Message Structure: The structure and purpose of the XML content also guide the choice. For instance, messages for payments will generally use PACS classes, while account management and reporting might use CAMT classes.