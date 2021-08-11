# Domande Esami Mobile

## 29-06-2015

#### Describe Fragment lifecycle, both static and dynamic
- Static lifecycle: a Fragment is constructed when the Activity it is associated to is created, but at that point it isn't part of the application state, because it isn't attached yet. After the Fragment is attached to the Activity (onAttach(context)) it is created (onCreate(...), onCreateView(...), onViewCreated(...)) but it isn't visible yet. Only after the Activity's onStart(...) method is called the same method is called for the Fragment, making it visible and interactable. Calling any of onPause(...), onResume(...) or onStop(...) from the attached Activity calls the same method for the Fragment while, when the Activity is destroyed with onDestroy(...) the Fragment is also destroyed, calling in order onDestroyView(...), onDestroy(...) and onDetach(...).
- Dynamic lifecycle: happens when a Fragment is added dynamically from an Activity (for example, pressing a Button in the Activity triggers the insertion of a new Fragment with the FragmentManager). After the event that causes the addition of the new Fragment is completed the Fragment is attached (onAttach(...)), created (onCreate(...), onCreateView(...), onViewCreated(...)) and then started and resumed (onStart(...), onResume(...)).

#### Describe resources and how they're involved in app responsiveness
Resources are additional files and static content used by an application, such as bitmaps, image files, UI text strings, animation instructions, layout definitions.
They should be externalized from code so that they can be maintained independently and alternative resources should also be present, to account for different and specific device configurations (alternative resources are grouped in different folders identified by name): at runtime the code uses the resources specified for the current configuration. Resources are accessed in code through internal ID values (integers), and are grouped by category (layouts, strings, colors, styles, drawables)

#### What are the main problems a Custom View has to care about?
A custom View has to mainly care about:
1. Negotiating with its container the space it needs to actually paint on screen
2. Laying out its children in the space it receives
3. Drawing the View in the received space
It also should override the methods onSaveInstanceState(...) and onRestoreInstanceState(...), so that it can properly save and restore its own state.

## 20-07-2015

#### Describe service lifecycle, both started and bound
- Started Service: it runs in background even if the component that started it has been destroyed, as long as it's present in the status bar. A started Service is made active after an Application component (Activity, Fragment) calls the method startService(...), which turns the service active by calling the service's onCreate(...). A component can then make the Service start running by calling onStartCommand(...); a service stops being active when it's stopped, either by a client or by itself when the task it has to accomplish has been completed, and its onDestroy(...) method is called, shutting down the Service. 
- Bound Service: it offers a client-server interface, allowing the invoking component to interact with it by sending requests and obtaining results; its lifecycle is tied to the one of the component/components to which it is connected to. A bound Service is made active after an Application component calls bindService(...), which in turn calls the Service's onCreate(...) method. Components can become bound to a Service by callind onBind(...) and can then unbind by calling unbindService(...), which in turn calls onUnbind(...); when all components are unbounded from a Service onDestroy(...) is called and the service is shut down.

#### Describe the pipeline of the Canvas object
The creation of a Canvas object is done through a pipeline divided into four steps:
1. Transformation. Points existing in a User reference system are provided to the objects to paint and are transformed in coordinates on the screen.
2. Rasterization. Computing the set of pixels affected by the graphical primitives to be drawn, either totally or just partially affected.
3. Clipping. Identifies the pixels on screen that have to be modified by defining a mask to interpose on the entire screen, deciding the subset of rasterized pixels that have to be modified.
4. Composition. Blending of the created colored pixels with the already existing ones.

## 09-2016

#### Illustrate the lifecycle of the activity and relate it to the underlying gui
An Activity starts existing when its method onCreate(...) is called, but when said method is the only one called the Activity isn't visible to the user yet; calling onStart(...) makes the Activity visible but not interactable (it is partially obscured by another window put on top of it) while only after onResume(...) is called the Activity is both visible and interactable with by the user. The Activity can then be paused with onPause(...), which still makes it partially visible and then, while it is paused and onStop(...) is called the Activity is stopped and becomes hidden, not visible anymore to the user. Calling onDestroy(...) from a stopped Activity destroys it, making it not present anymore.

#### Explain the definition and role of the android manifest file
An Android application's Manifest File is an XML file put at the root of the project source set.
Its purpose is declaring the application's package name, all the components used (activities, services, content providers, broadcast receivers), the permissions the application needs in order to access protected parts of the system or of other apps (use of camera, for example, or the ability to send messages through SMS by accessing contacts), as well as the permissions required by other apps to access content of the application, the hardware and software features required by the app. It specifies which is the main Activity of the application, which Services used by the app are private, which Intents can be used by each component

#### Describe working structure of handler / looper threads
A Looper is a class that manages a queue associated with a single thread, it is created with the method Looper.prepare() and is owned by the thread that invokes said method; it works as an infinite loop, started by the method Looper.loop(), that waits for messages sent by other threads; Looper objects can be accessed only by the thread that owns them, except for the main Looper, which can be accessed by every thread.
It interacts with a Handler, a class providing a thread-safe interface for inserting and processing new requests inside a Looper queue, with the rule that a Handler is bound to the queue associated to the thread in which it was created. Messages sent through a Handler are processed by the associated Looper and a Looper can be associated with many different Handlers, who can all put messages in the same queue, and when messages are picked up they're processed by the Handler that inserted them.

## 07-07-2017

#### Activity come ne chiama un'altra e lifecycle di entrambe
An Activity may call another one by defining an Intent, a special object which can be used to specify the intent of an application to do something. By creating the Intent with the context of the current Activity and the class corresponding to the second Activity (val intent = Intent(this, SecondActivity::class.java)) it is possible to launch the new Activity (startActivity(intent)). The lifecycle of the second Activity is strictly bound to that of the calling one: only after startActivity(...) is launched the onCreate(...) method of the second Activity will be called, and then the natural creation will follow (onStart(...) and then onResume(...)), with the first Activity being paused after startActivity(...) and stopped when the second Activity's onCreate(...) method is called; when the second Activity terminates its task it is destroyed (onDestroy(...)) and the first one can resume its operation with onRestart(...).

#### AsyncTask
An AsyncTask is one of the possible extensions used in Android to handle thread behavior; it is an abstract and parametric class that defines a task to be performed in a secondary thread, offering at the same time a set of methods that will be invoked from the main thread when it will be appropriate. It's a deprecated solution in favor of coroutines.


## 11-09-2017

#### Android application life cycle
An Application object is created when an external event (clicking on an app's icon, for example) causes the creation of a new process, inside which a single Application object is instantiated and is then notified with the ongoing status of the elaboration. When the Application object is correctly created and notified of the beginning of the process Android instantiates an Activity object corresponding to the main activity of the application and any other component (service, content provider, broadcast receiver) initially needed by the application, then the graphical user interface associated to the main activity is populated and shown to the user. An application remains in memory as long as it still has active components (components of an app are removed when the user closes it).

## 25-07-2020

#### Describe the basic principles behind the design of the Kotlin programming language and the benefits they introduce in developing a mobile application

#### What are hooks in React Native and how are they used in order to keep the internal state of an app?
Hooks are special functions that are directly connected with the lifecycle of a component and are used to efficiently manage said component's inner state. One example of Hook function is useState(), which is used to create a new state variable inside the component in which it's called and works by returning an array of two parameters: the newly created state variable and a function, initialized with the value passed as argument to the function (ex: [count, setCount] = useState(0) creates a state value named 'count' initialized with value 0) that can be used to modify the state variable's value (setCount(5) changes the value of the state variable 'count'); it is mandatory to always use the setter function to change the value of a state variable, since changes made to it force a re-render of the entire component.
Hooks can only be called at top level of a Component and never inside loops, conditions or nested functions, and they can only be called from React functions or custom hooks (user-made functions made for reuse across different components, their name must start with 'use', they must call other hooks and follow the same rules as other hooks).

## 01-07-2021

#### Explain the RecyclerView.Adapter two phase protocol for efficiently displaying large data collections.
A RecyclerView is an Android class which is used to manage the presentation of potentially large data sets, it displays only a limited part of the items in the set on screen at a time, keeping a single "ghost item" out of it that becomes part of the hierarcy when the screen is scrolled, making the ghost item visible and the item that isn't visible anymore become the new ghost item. The presented items are managed by an Adapter, which creates the needed ViewHolders that will be used to display the layout of each visible item that is part of the collection.
The Adapter has to override three methods to function correctly:
- getItemCount(), stores the data model and offers a method to retrieve the total number of items
- onCreateViewHolder(), supports creation of a new ViewHolder and the associated visual hierarchy tree
- onBindViewHolder(), populates the created visual tree with the ViewHolder displaying data of a specific item.
- 

#### Describe how a ReactNative application can manage its global state and make it available, in a consistent way, to all components.