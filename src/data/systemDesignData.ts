import { DesignPattern, SystemDesignProblem } from "../types";

// ──────────────────────────────────────────────
// LLB — DESIGN PATTERNS DATA
// ──────────────────────────────────────────────

export const DESIGN_PATTERNS: DesignPattern[] = [
  // ═══════════════════════════════════════════
  // CREATIONAL PATTERNS
  // ═══════════════════════════════════════════
  {
    id: "lld-singleton",
    name: "Singleton",
    category: "creational",
    intent: "Ensure a class has only one instance and provide a global point of access to it.",
    problem: "You need exactly one instance of a class (e.g., database connection, logger, configuration manager) and want to control access to it globally.",
    solution: "Make the constructor private, create a static method that returns the single instance, and lazily initialize it on first use.",
    participants: [
      { id: "Singleton", name: "Singleton", type: "class", methods: ["getInstance()", "getData()", "setData()"], fields: ["- instance: Singleton", "- data: any"] },
    ],
    structure: [],
    codeExample: `public class Singleton {
    private static volatile Singleton instance;
    private Object data;

    private Singleton() {
        this.data = null;
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }

    public void setData(Object data) { this.data = data; }
    public Object getData() { return this.data; }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Singleton s1 = Singleton.getInstance();
        s1.setData("Hello");
        Singleton s2 = Singleton.getInstance();
        System.out.println(s2.getData()); // "Hello" (same instance)
    }
}`,
    realWorldExample: "A national government — there is only one central government for a country, providing a single point of control for laws and policies.",
    whenToUse: [
      "Exactly one instance of a class is required",
      "The instance must be accessible from a global access point",
      "You want to control lazy initialization",
    ],
    pros: ["Controlled access to single instance", "Lazy initialization possible", "Global access point", "Avoids global variables"],
    cons: ["Violates Single Responsibility Principle", "Global state can hide dependencies", "Hard to unit test (mocking)", "Not thread-safe by default"],
  },
  {
    id: "lld-factory-method",
    name: "Factory Method",
    category: "creational",
    intent: "Define an interface for creating an object, but let subclasses decide which class to instantiate.",
    problem: "A class can't anticipate the type of objects it needs to create. You want to delegate object creation to subclasses.",
    solution: "Define a factory method in the base class/interface. Subclasses override this method to create specific product types.",
    participants: [
      { id: "Creator", name: "Creator", type: "abstract-class", methods: ["factoryMethod(): Product", "someOperation()"], fields: [] },
      { id: "ConcreteCreator", name: "ConcreteCreator", type: "class", methods: ["factoryMethod(): Product"], fields: [] },
      { id: "Product", name: "Product", type: "interface", methods: ["doStuff()"], fields: [] },
      { id: "ConcreteProduct", name: "ConcreteProduct", type: "class", methods: ["doStuff()"], fields: [] },
    ],
    structure: [
      { from: "ConcreteCreator", to: "Creator", type: "inheritance" },
      { from: "ConcreteProduct", to: "Product", type: "implementation" },
      { from: "Creator", to: "Product", type: "dependency", toLabel: "creates" },
    ],
    codeExample: `interface Transport {
    void deliver();
}

class Truck implements Transport {
    public void deliver() { System.out.println("Deliver by land"); }
}

class Ship implements Transport {
    public void deliver() { System.out.println("Deliver by sea"); }
}

abstract class Logistics {
    abstract Transport createTransport();

    void planDelivery() {
        Transport transport = createTransport();
        transport.deliver();
    }
}

class RoadLogistics extends Logistics {
    Transport createTransport() { return new Truck(); }
}

class SeaLogistics extends Logistics {
    Transport createTransport() { return new Ship(); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        new RoadLogistics().planDelivery(); // "Deliver by land"
    }
}`,
    realWorldExample: "A recruitment agency (Creator) has a generic 'hire' process. Different departments (ConcreteCreators) create specific roles (Products) like Engineer, Designer, or Manager.",
    whenToUse: [
      "You don't know the exact types of objects your code will work with",
      "You want to provide a way to extend your framework's components",
      "You want to save system resources by reusing existing objects",
    ],
    pros: ["Avoids tight coupling between creator and concrete products", "Single Responsibility Principle", "Open/Closed Principle"],
    cons: ["May require subclassing just to create objects", "Can become complex with many subclasses"],
  },
  {
    id: "lld-abstract-factory",
    name: "Abstract Factory",
    category: "creational",
    intent: "Provide an interface for creating families of related or dependent objects without specifying their concrete classes.",
    problem: "You need to create families of related products, and you want to ensure that products from different families are not mixed.",
    solution: "Define abstract factory interface with creation methods for each product type. Each concrete factory implements the interface to create a specific variant family.",
    participants: [
      { id: "AbstractFactory", name: "AbstractFactory", type: "interface", methods: ["createProductA()", "createProductB()"], fields: [] },
      { id: "ConcreteFactory1", name: "ConcreteFactory1", type: "class", methods: ["createProductA()", "createProductB()"], fields: [] },
      { id: "ConcreteFactory2", name: "ConcreteFactory2", type: "class", methods: ["createProductA()", "createProductB()"], fields: [] },
      { id: "ProductA", name: "AbstractProductA", type: "interface", methods: [], fields: [] },
      { id: "ProductB", name: "AbstractProductB", type: "interface", methods: [], fields: [] },
    ],
    structure: [
      { from: "ConcreteFactory1", to: "AbstractFactory", type: "implementation" },
      { from: "ConcreteFactory2", to: "AbstractFactory", type: "implementation" },
      { from: "ConcreteFactory1", to: "ProductA", type: "dependency", toLabel: "creates" },
      { from: "ConcreteFactory2", to: "ProductB", type: "dependency", toLabel: "creates" },
    ],
    codeExample: `interface Button { void render(); }
interface Checkbox { void render(); }

class WinButton implements Button {
    public void render() { System.out.println("Windows Button"); }
}
class MacButton implements Button {
    public void render() { System.out.println("Mac Button"); }
}
class WinCheckbox implements Checkbox {
    public void render() { System.out.println("Windows Checkbox"); }
}
class MacCheckbox implements Checkbox {
    public void render() { System.out.println("Mac Checkbox"); }
}

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WinFactory implements GUIFactory {
    public Button createButton() { return new WinButton(); }
    public Checkbox createCheckbox() { return new WinCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        GUIFactory factory = new WinFactory();
        factory.createButton().render(); // "Windows Button"
    }
}`,
    realWorldExample: "Furniture stores (IKEA, Ashley) produce complete furniture families (Victorian, Modern). Each family has matching chair, sofa, and coffee table — you can't mix Victorian chair with Modern sofa.",
    whenToUse: [
      "Your system needs to be independent of how its products are created",
      "You work with multiple families of related products",
      "You want to enforce consistency among products",
    ],
    pros: ["Products are guaranteed to be compatible", "Avoids coupling concrete classes", "Open/Closed Principle", "Single Responsibility Principle"],
    cons: ["Complexity increases with many product types", "Adding new products requires changing the interface"],
  },
  {
    id: "lld-builder",
    name: "Builder",
    category: "creational",
    intent: "Separate the construction of a complex object from its representation so the same construction process can create different representations.",
    problem: "An object requires many configuration parameters, and you want to avoid telescoping constructors while making the construction process readable.",
    solution: "Extract object construction code into separate Builder objects. The Director controls the construction steps. The Builder provides the methods to configure each part.",
    participants: [
      { id: "Builder", name: "Builder", type: "interface", methods: ["buildPartA()", "buildPartB()", "getResult()"], fields: [] },
      { id: "ConcreteBuilder", name: "ConcreteBuilder", type: "class", methods: ["buildPartA()", "buildPartB()", "getResult()"], fields: ["- product: Product"] },
      { id: "Director", name: "Director", type: "class", methods: ["construct()"], fields: ["- builder: Builder"] },
      { id: "Product", name: "Product", type: "class", methods: [], fields: ["- parts: string[]"] },
    ],
    structure: [
      { from: "ConcreteBuilder", to: "Builder", type: "implementation" },
      { from: "Director", to: "Builder", type: "dependency", toLabel: "uses" },
      { from: "ConcreteBuilder", to: "Product", type: "dependency", toLabel: "builds" },
    ],
    codeExample: `class Pizza {
    public String size = "";
    public boolean cheese = false;
    public boolean pepperoni = false;
    public boolean mushrooms = false;
    
    public String toString() {
        return "Pizza(" + size + ", cheese=" + cheese +
               ", pepperoni=" + pepperoni + ", mushrooms=" + mushrooms + ")";
    }
}

class PizzaBuilder {
    private Pizza pizza = new Pizza();

    public PizzaBuilder setSize(String size) {
        this.pizza.size = size; return this;
    }
    public PizzaBuilder addCheese() {
        this.pizza.cheese = true; return this;
    }
    public PizzaBuilder addPepperoni() {
        this.pizza.pepperoni = true; return this;
    }
    public PizzaBuilder addMushrooms() {
        this.pizza.mushrooms = true; return this;
    }
    public Pizza build() { return this.pizza; }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Pizza pizza = new PizzaBuilder()
            .setSize("Large")
            .addCheese()
            .addPepperoni()
            .build();
        System.out.println(pizza);
    }
}`,
    realWorldExample: "A Subway sandwich shop — you go through a step-by-step process: choose bread → choose toppings → choose sauces → toast. The same process creates different sandwiches.",
    whenToUse: [
      "You have complex objects with many optional components",
      "You want to create different representations using the same process",
      "You want to avoid telescoping constructors",
    ],
    pros: ["Step-by-step construction", "Reuses same construction code", "Single Responsibility Principle", "Fluent interface possible"],
    cons: ["Requires creating separate Builder for each type", "Can be overkill for simple objects"],
  },
  {
    id: "lld-prototype",
    name: "Prototype",
    category: "creational",
    intent: "Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.",
    problem: "Creating objects is expensive (database calls, complex initialization) and you want to avoid re-initializing from scratch.",
    solution: "Implement a clone() method on the prototype interface. Each concrete prototype implements cloning to create a copy of itself.",
    participants: [
      { id: "Prototype", name: "Prototype", type: "interface", methods: ["clone()"], fields: [] },
      { id: "ConcretePrototype1", name: "ConcretePrototype1", type: "class", methods: ["clone()"], fields: ["- field1: string"] },
      { id: "ConcretePrototype2", name: "ConcretePrototype2", type: "class", methods: ["clone()"], fields: ["- field2: number"] },
    ],
    structure: [
      { from: "ConcretePrototype1", to: "Prototype", type: "implementation" },
      { from: "ConcretePrototype2", to: "Prototype", type: "implementation" },
    ],
    codeExample: `interface Prototype {
    Prototype clone();
}

class Shape implements Prototype {
    private int x, y;
    private String color;

    public Shape(int x, int y, String color) {
        this.x = x; this.y = y; this.color = color;
    }

    public Prototype clone() {
        return new Shape(this.x, this.y, this.color);
    }
    
    public String toString() {
        return "Shape(" + x + "," + y + "," + color + ")";
    }
}

class Circle extends Shape {
    private int radius;

    public Circle(int x, int y, String color, int radius) {
        super(x, y, color);
        this.radius = radius;
    }

    public Prototype clone() {
        return new Circle(x, y, color, radius); // using inherited fields
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Circle circle = new Circle(10, 20, "red", 5);
        Circle clone = (Circle) circle.clone();
        System.out.println(clone);
    }
}`,
    realWorldExample: "A cookie cutter — once you have a cookie cutter (prototype), you can produce countless identical cookies without remeasuring or reshaping each time.",
    whenToUse: [
      "Object creation is expensive (DB, network, complex init)",
      "You want to avoid subclassing for object creation",
      "You need to create many similar objects with slight variations",
    ],
    pros: ["Clones without coupling to concrete classes", "Avoids repeated initialization", "Can replace complex constructors", "Great for caching"],
    cons: ["Deep cloning complex objects can be tricky", "Circular references are difficult to clone"],
  },

  // ═══════════════════════════════════════════
  // STRUCTURAL PATTERNS
  // ═══════════════════════════════════════════
  {
    id: "lld-adapter",
    name: "Adapter",
    category: "structural",
    intent: "Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that couldn't otherwise due to incompatible interfaces.",
    problem: "You have an existing class with a useful service but its interface doesn't match what your client code expects.",
    solution: "Create an adapter class that wraps the incompatible object (Adaptee) and implements the target interface that the client expects.",
    participants: [
      { id: "Target", name: "Target", type: "interface", methods: ["request()"], fields: [] },
      { id: "Adapter", name: "Adapter", type: "class", methods: ["request()"], fields: ["- adaptee: Adaptee"] },
      { id: "Adaptee", name: "Adaptee", type: "class", methods: ["specificRequest()"], fields: [] },
      { id: "Client", name: "Client", type: "class", methods: [], fields: [] },
    ],
    structure: [
      { from: "Adapter", to: "Target", type: "implementation" },
      { from: "Adapter", to: "Adaptee", type: "composition" },
      { from: "Client", to: "Target", type: "dependency", toLabel: "uses" },
    ],
    codeExample: `interface MediaPlayer {
    void play(String audioType, String fileName);
}

class AdvancedMediaPlayer {
    public void playVlc(String fileName) {
        System.out.println("Playing vlc: " + fileName);
    }
    public void playMp4(String fileName) {
        System.out.println("Playing mp4: " + fileName);
    }
}

class MediaAdapter implements MediaPlayer {
    private AdvancedMediaPlayer advancedPlayer;

    public MediaAdapter(AdvancedMediaPlayer advancedPlayer) {
        this.advancedPlayer = advancedPlayer;
    }

    public void play(String audioType, String fileName) {
        if (audioType.equals("vlc")) advancedPlayer.playVlc(fileName);
        else if (audioType.equals("mp4")) advancedPlayer.playMp4(fileName);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        MediaAdapter adapter = new MediaAdapter(new AdvancedMediaPlayer());
        adapter.play("mp4", "movie.mp4"); // "Playing mp4: movie.mp4"
    }
}`,
    realWorldExample: "A power plug adapter — a US plug (Adaptee) has a different shape than a European socket (Target). The travel adapter (Adapter) bridges the two, letting US devices work in European outlets.",
    whenToUse: [
      "You want to use an existing class but its interface doesn't match",
      "You want to create a reusable class that cooperates with unrelated classes",
      "You need to integrate with a legacy system",
    ],
    pros: ["Single Responsibility Principle", "Open/Closed Principle", "Lets unrelated classes work together"],
    cons: ["Overall complexity increases", "May require creating many adapters"],
  },
  {
    id: "lld-decorator",
    name: "Decorator",
    category: "structural",
    intent: "Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.",
    problem: "You need to add behaviors to individual objects at runtime without affecting other objects from the same class.",
    solution: "Create a decorator class that wraps the original object. The decorator implements the same interface and delegates to the wrapped object, adding its own behavior before/after.",
    participants: [
      { id: "Component", name: "Component", type: "interface", methods: ["operation()"], fields: [] },
      { id: "ConcreteComponent", name: "ConcreteComponent", type: "class", methods: ["operation()"], fields: [] },
      { id: "BaseDecorator", name: "BaseDecorator", type: "abstract-class", methods: ["operation()"], fields: ["- wrappee: Component"] },
      { id: "ConcreteDecoratorA", name: "ConcreteDecoratorA", type: "class", methods: ["operation()"], fields: [] },
    ],
    structure: [
      { from: "ConcreteComponent", to: "Component", type: "implementation" },
      { from: "BaseDecorator", to: "Component", type: "implementation" },
      { from: "BaseDecorator", to: "Component", type: "composition", toLabel: "wraps" },
      { from: "ConcreteDecoratorA", to: "BaseDecorator", type: "inheritance" },
    ],
    codeExample: `interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number { return 10; }
  description(): string { return "Simple coffee"; }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}
  abstract cost(): number;
  abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
  cost(): number { return this.coffee.cost() + 5; }
  description(): string { return this.coffee.description() + ", Milk"; }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number { return this.coffee.cost() + 2; }
  description(): string { return this.coffee.description() + ", Sugar"; }
}

// Usage
let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
console.log(coffee.description() + " = $" + coffee.cost());
// "Simple coffee, Milk, Sugar = $17"`,
    realWorldExample: "A pizza shop — you start with a base pizza and add toppings dynamically (cheese, pepperoni, mushrooms). Each topping adds cost and changes the description, without creating a subclass for every combination.",
    whenToUse: [
      "You need to add behaviors to objects at runtime",
      "You want to avoid subclassing for every combination of features",
      "You want to be able to extend a class without modifying it",
    ],
    pros: ["More flexible than inheritance", "Avoids feature-laden parent classes", "Open/Closed Principle", "Composable"],
    cons: ["Hard to remove specific wrappers", "Can result in many small classes", "Order of decorators matters"],
  },
  {
    id: "lld-proxy",
    name: "Proxy",
    category: "structural",
    intent: "Provide a surrogate or placeholder for another object to control access to it.",
    problem: "You want to control access to an object (for lazy loading, access control, logging, or caching) without changing the client code.",
    solution: "Create a proxy class with the same interface as the real subject. The proxy controls access to the real subject, performing actions before/after delegating.",
    participants: [
      { id: "Subject", name: "Subject", type: "interface", methods: ["request()"], fields: [] },
      { id: "RealSubject", name: "RealSubject", type: "class", methods: ["request()"], fields: [] },
      { id: "Proxy", name: "Proxy", type: "class", methods: ["request()"], fields: ["- realSubject: RealSubject"] },
    ],
    structure: [
      { from: "RealSubject", to: "Subject", type: "implementation" },
      { from: "Proxy", to: "Subject", type: "implementation" },
      { from: "Proxy", to: "RealSubject", type: "composition", toLabel: "controls" },
    ],
    codeExample: `interface Image {
    void display();
}

class RealImage implements Image {
    private String filename;

    public RealImage(String filename) {
        this.filename = filename;
        loadFromDisk(); // Expensive operation
    }
    private void loadFromDisk() { System.out.println("Loading: " + filename); }
    public void display() { System.out.println("Displaying: " + filename); }
}

class ProxyImage implements Image {
    private RealImage realImage;
    private String filename;

    public ProxyImage(String filename) { this.filename = filename; }

    public void display() {
        if (realImage == null) {
            realImage = new RealImage(filename); // Lazy load
        }
        realImage.display();
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Image image = new ProxyImage("photo.jpg");
        // Image NOT loaded yet
        image.display(); // Loads & displays
        image.display(); // Only displays (cached)
    }
}`,
    realWorldExample: "A credit card (Proxy) is a proxy for your bank account (RealSubject). The card controls access, provides logging, and can add caching (holds pending transactions) — the merchant doesn't need to interact with the bank directly.",
    whenToUse: [
      "Lazy initialization (virtual proxy)",
      "Access control to a sensitive object (protection proxy)",
      "Logging requests (logging proxy)",
      "Caching (caching proxy)",
    ],
    pros: ["Controls access to the real object", "Can add behaviors without changing the real object", "Can lazy-load expensive objects"],
    cons: ["Adds a layer of indirection", "May increase response time slightly"],
  },
  {
    id: "lld-facade",
    name: "Facade",
    category: "structural",
    intent: "Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.",
    problem: "A complex subsystem with many interdependent classes makes it hard for clients to use. The client code becomes tightly coupled to many classes.",
    solution: "Create a facade class that provides a simple interface to the complex subsystem. The client interacts with the facade instead of the subsystem directly.",
    participants: [
      { id: "Facade", name: "Facade", type: "class", methods: ["simpleOperation()"], fields: [] },
      { id: "SubsystemA", name: "SubsystemA", type: "class", methods: ["complexOp1()"], fields: [] },
      { id: "SubsystemB", name: "SubsystemB", type: "class", methods: ["complexOp2()"], fields: [] },
      { id: "SubsystemC", name: "SubsystemC", type: "class", methods: ["complexOp3()"], fields: [] },
    ],
    structure: [
      { from: "Facade", to: "SubsystemA", type: "dependency", toLabel: "delegates to" },
      { from: "Facade", to: "SubsystemB", type: "dependency", toLabel: "delegates to" },
      { from: "Facade", to: "SubsystemC", type: "dependency", toLabel: "delegates to" },
    ],
    codeExample: `class CPU {
    public void freeze() { System.out.println("CPU frozen"); }
    public void jump(int position) { System.out.println("Jump to " + position); }
    public void execute() { System.out.println("CPU executing"); }
}

class Memory {
    public void load(int position, String data) {
        System.out.println("Load '" + data + "' at " + position);
    }
}

class HardDrive {
    public String read(int lba, int size) {
        return "boot_data_" + lba;
    }
}

class ComputerFacade {
    private CPU cpu = new CPU();
    private Memory memory = new Memory();
    private HardDrive hd = new HardDrive();

    public void start() {
        cpu.freeze();
        memory.load(0, hd.read(0, 1024));
        cpu.jump(0);
        cpu.execute();
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        new ComputerFacade().start(); // Simple one-call interface
    }
}`,
    realWorldExample: "A restaurant waiter (Facade) — you tell the waiter your order (simple interface), and they handle the complex subsystem: passing to the kitchen, coordinating with the bar, handling billing, etc. You don't interact with the chef, bartender, or cashier directly.",
    whenToUse: [
      "You want to provide a simple interface to a complex subsystem",
      "You want to decouple clients from subsystem components",
      "You want to layer your subsystems",
    ],
    pros: ["Isolates complexity", "Promotes loose coupling", "Reduces compilation dependencies", "Simplifies client code"],
    cons: ["Can become a god object coupled to all classes", "May not satisfy advanced users who need fine-grained control"],
  },
  {
    id: "lld-composite",
    name: "Composite",
    category: "structural",
    intent: "Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions uniformly.",
    problem: "You have a tree-like structure where individual objects and groups of objects should be treated the same way.",
    solution: "Define a component interface with common operations. Leaf objects implement the interface directly. Composite objects implement the interface but delegate to their children.",
    participants: [
      { id: "Component", name: "Component", type: "interface", methods: ["operation()", "add(c: Component)", "remove(c: Component)"], fields: [] },
      { id: "Leaf", name: "Leaf", type: "class", methods: ["operation()"], fields: [] },
      { id: "Composite", name: "Composite", type: "class", methods: ["operation()", "add(c: Component)", "remove(c: Component)"], fields: ["- children: Component[]"] },
    ],
    structure: [
      { from: "Leaf", to: "Component", type: "implementation" },
      { from: "Composite", to: "Component", type: "implementation" },
      { from: "Composite", to: "Component", type: "composition", toLabel: "contains ►" },
    ],
    codeExample: `import java.util.*;

interface FileSystemNode {
    String getName();
    int getSize();
}

class File implements FileSystemNode {
    private String name;
    private int size;
    public File(String name, int size) { this.name = name; this.size = size; }
    public String getName() { return name; }
    public int getSize() { return size; }
}

class Directory implements FileSystemNode {
    private String name;
    private List<FileSystemNode> children = new ArrayList<>();

    public Directory(String name) { this.name = name; }

    public void add(FileSystemNode child) { children.add(child); }
    public String getName() { return name; }

    public int getSize() {
        int sum = 0;
        for (FileSystemNode c : children) sum += c.getSize();
        return sum;
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        Directory folder = new Directory("Downloads");
        folder.add(new File("photo.jpg", 500));
        folder.add(new File("doc.pdf", 200));

        Directory subFolder = new Directory("Music");
        subFolder.add(new File("song.mp3", 3000));
        folder.add(subFolder);

        System.out.println(folder.getSize()); // 3700 (sum of all)
    }
}`,
    realWorldExample: "A file system — both files (Leaf) and folders (Composite) can be renamed, deleted, and have their size calculated. Operations on a folder recursively apply to all its children.",
    whenToUse: [
      "You have a tree structure with simple and complex elements",
      "You want clients to treat leaf and composite objects uniformly",
      "You want to add new component types easily",
    ],
    pros: ["Makes it easy to work with tree structures", "Open/Closed Principle", "Uniform treatment of simple and complex elements"],
    cons: ["Can make the design overly general", "Hard to restrict types of components in a composite"],
  },
  {
    id: "lld-bridge",
    name: "Bridge",
    category: "structural",
    intent: "Decouple an abstraction from its implementation so the two can vary independently.",
    problem: "When you have multiple dimensions of variation (e.g., different device types and different remote controls), class explosion occurs with inheritance.",
    solution: "Split the class hierarchy into two parts: abstraction (high-level control logic) and implementation (device-specific code). Connect them via composition.",
    participants: [
      { id: "Abstraction", name: "Abstraction", type: "abstract-class", methods: ["operation()"], fields: ["- impl: Implementor"] },
      { id: "RefinedAbstraction", name: "RefinedAbstraction", type: "class", methods: ["operation()"], fields: [] },
      { id: "Implementor", name: "Implementor", type: "interface", methods: ["operationImpl()"], fields: [] },
      { id: "ConcreteImplementor", name: "ConcreteImplementor", type: "class", methods: ["operationImpl()"], fields: [] },
    ],
    structure: [
      { from: "RefinedAbstraction", to: "Abstraction", type: "inheritance" },
      { from: "Abstraction", to: "Implementor", type: "composition", toLabel: "has" },
      { from: "ConcreteImplementor", to: "Implementor", type: "implementation" },
    ],
    codeExample: `interface Device {
    boolean isEnabled();
    void enable();
    void disable();
    int getVolume();
    void setVolume(int percent);
}

class TV implements Device {
    private boolean on = false;
    private int volume = 50;
    public boolean isEnabled() { return on; }
    public void enable() { on = true; System.out.println("TV On"); }
    public void disable() { on = false; System.out.println("TV Off"); }
    public int getVolume() { return volume; }
    public void setVolume(int v) { volume = v; }
}

class Radio implements Device {
    private boolean on = false;
    private int volume = 30;
    public boolean isEnabled() { return on; }
    public void enable() { on = true; System.out.println("Radio On"); }
    public void disable() { on = false; System.out.println("Radio Off"); }
    public int getVolume() { return volume; }
    public void setVolume(int v) { volume = v; }
}

class RemoteControl {
    protected Device device;
    public RemoteControl(Device device) { this.device = device; }
    public void togglePower() {
        if (device.isEnabled()) device.disable();
        else device.enable();
    }
    public void volumeUp() { device.setVolume(device.getVolume() + 10); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        RemoteControl remote = new RemoteControl(new TV());
        remote.togglePower(); // "TV On"
    }
}`,
    realWorldExample: "A universal remote (Abstraction) can control different devices (Implementors) like TVs and Radios. The remote logic stays the same, while each device implements its own specifics. Both can vary independently.",
    whenToUse: [
      "You want to avoid permanent binding between abstraction and implementation",
      "Both abstraction and implementation should be extensible by subclassing",
      "Changes in implementation should not affect client code",
    ],
    pros: ["Separates interface from implementation", "Improves extensibility", "Hides implementation details from clients"],
    cons: ["Increases complexity", "Requires understanding of the pattern upfront"],
  },
  {
    id: "lld-flyweight",
    name: "Flyweight",
    category: "structural",
    intent: "Use sharing to support large numbers of fine-grained objects efficiently.",
    problem: "Your application creates too many objects, consuming too much memory. Many objects share common intrinsic state.",
    solution: "Separate intrinsic (shared) state from extrinsic (context-specific) state. Store intrinsic state in flyweight objects and reuse them across contexts.",
    participants: [
      { id: "Flyweight", name: "Flyweight", type: "interface", methods: ["operation(extrinsicState)"], fields: [] },
      { id: "ConcreteFlyweight", name: "ConcreteFlyweight", type: "class", methods: ["operation(extrinsicState)"], fields: ["- intrinsicState: string"] },
      { id: "FlyweightFactory", name: "FlyweightFactory", type: "class", methods: ["getFlyweight(key)"], fields: ["- cache: Map<string, Flyweight>"] },
    ],
    structure: [
      { from: "ConcreteFlyweight", to: "Flyweight", type: "implementation" },
      { from: "FlyweightFactory", to: "Flyweight", type: "dependency", toLabel: "creates/manages" },
    ],
    codeExample: `import java.util.*;

class TreeType {
    private String name, color, texture;
    public TreeType(String name, String color, String texture) {
        this.name = name; this.color = color; this.texture = texture;
    }
    public void draw(int x, int y) {
        System.out.println("Drawing " + name + " at (" + x + "," + y + ")");
    }
}

class TreeFactory {
    private static Map<String, TreeType> treeTypes = new HashMap<>();

    public static TreeType getTreeType(String name, String color, String texture) {
        String key = name + "-" + color + "-" + texture;
        if (!treeTypes.containsKey(key)) {
            treeTypes.put(key, new TreeType(name, color, texture));
        }
        return treeTypes.get(key);
    }
}

class Tree {
    private int x, y;
    private TreeType type;
    public Tree(int x, int y, TreeType type) { this.x = x; this.y = y; this.type = type; }
    public void draw() { type.draw(x, y); }
}

// Usage: 10000 trees but only few TreeType objects
public class Main {
    public static void main(String[] args) {
        List<Tree> forest = new ArrayList<>();
        for (int i = 0; i < 5000; i++) {
            forest.add(new Tree(i, i, TreeFactory.getTreeType("Oak", "Green", "Rough")));
        }
        // Only few TreeType instances for 5000 trees!
    }
}`,
    realWorldExample: "A library — books with the same title/author/ISBN (intrinsic state) are the same type, but each copy (extrinsic state: shelf location, borrower) differs. The library stores the book metadata once and tracks each copy separately.",
    whenToUse: [
      "Your application uses a large number of objects",
      "Storage costs are high due to object quantity",
      "Most object state can be made extrinsic",
    ],
    pros: ["Reduces memory usage significantly", "Reduces number of objects", "Centralizes state management"],
    cons: ["Adds complexity with extrinsic/intrinsic separation", "Requires a factory to manage flyweights", "May increase CPU time"],
  },

  // ═══════════════════════════════════════════
  // BEHAVIORAL PATTERNS
  // ═══════════════════════════════════════════
  {
    id: "lld-observer",
    name: "Observer",
    category: "behavioral",
    intent: "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
    problem: "You have an object (subject) that needs to notify multiple other objects (observers) when its state changes, without coupling them tightly.",
    solution: "Define a subject interface with methods to attach/detach observers. When the subject's state changes, it iterates over all observers and calls their update method.",
    participants: [
      { id: "Subject", name: "Subject", type: "interface", methods: ["attach(o: Observer)", "detach(o: Observer)", "notify()"], fields: [] },
      { id: "ConcreteSubject", name: "ConcreteSubject", type: "class", methods: ["getState()", "setState(s)"], fields: ["- observers: Observer[]", "- state: State"] },
      { id: "Observer", name: "Observer", type: "interface", methods: ["update(subject)"], fields: [] },
      { id: "ConcreteObserver", name: "ConcreteObserver", type: "class", methods: ["update(subject)"], fields: ["- state: State"] },
    ],
    structure: [
      { from: "ConcreteSubject", to: "Subject", type: "implementation" },
      { from: "ConcreteObserver", to: "Observer", type: "implementation" },
      { from: "Subject", to: "Observer", type: "dependency", toLabel: "notifies" },
    ],
    codeExample: `import java.util.*;

interface Observer {
    void update(int temperature);
}

class WeatherStation {
    private List<Observer> observers = new ArrayList<>();
    private int temperature = 0;

    public void attach(Observer observer) { observers.add(observer); }
    public void detach(Observer observer) { observers.remove(observer); }

    public void setTemperature(int temp) {
        this.temperature = temp;
        notifyObservers();
    }

    private void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(temperature);
        }
    }
}

class PhoneDisplay implements Observer {
    public void update(int temp) {
        System.out.println("Phone Display: Temperature = " + temp + "°C");
    }
}

class WindowDisplay implements Observer {
    public void update(int temp) {
        System.out.println("Window Display: Temperature = " + temp + "°C");
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        WeatherStation station = new WeatherStation();
        station.attach(new PhoneDisplay());
        station.attach(new WindowDisplay());
        station.setTemperature(25); // Both displays get notified
    }
}`,
    realWorldExample: "A YouTube channel (Subject) — subscribers (Observers) get notified when a new video is uploaded. Subscribers can subscribe/unsubscribe at any time without affecting the channel.",
    whenToUse: [
      "Changes to one object require changing others, and you don't know how many",
      "Objects should be able to observe without tight coupling",
      "Broadcast communication is needed",
    ],
    pros: ["Loose coupling between subject and observers", "Supports broadcast communication", "Open/Closed Principle"],
    cons: ["Observers are notified in random order", "Memory leaks if observers aren't properly detached", "Can cause performance issues with many observers"],
  },
  {
    id: "lld-strategy",
    name: "Strategy",
    category: "behavioral",
    intent: "Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it.",
    problem: "You have multiple ways to perform an operation, and you want to switch between them at runtime without using conditionals.",
    solution: "Define a strategy interface for the algorithm. Create concrete strategy classes that implement the interface. The context class holds a reference to a strategy and delegates the work to it.",
    participants: [
      { id: "Strategy", name: "Strategy", type: "interface", methods: ["execute(data)"], fields: [] },
      { id: "ConcreteStrategyA", name: "ConcreteStrategyA", type: "class", methods: ["execute(data)"], fields: [] },
      { id: "ConcreteStrategyB", name: "ConcreteStrategyB", type: "class", methods: ["execute(data)"], fields: [] },
      { id: "Context", name: "Context", type: "class", methods: ["setStrategy(s)", "doWork()"], fields: ["- strategy: Strategy"] },
    ],
    structure: [
      { from: "ConcreteStrategyA", to: "Strategy", type: "implementation" },
      { from: "ConcreteStrategyB", to: "Strategy", type: "implementation" },
      { from: "Context", to: "Strategy", type: "composition", toLabel: "uses" },
    ],
    codeExample: `import java.util.*;

interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String name, cardNo;
    public CreditCardPayment(String name, String cardNo) { this.name = name; this.cardNo = cardNo; }
    public void pay(int amount) {
        System.out.println("Paid $" + amount + " via Credit Card " + cardNo);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    public PayPalPayment(String email) { this.email = email; }
    public void pay(int amount) {
        System.out.println("Paid $" + amount + " via PayPal (" + email + ")");
    }
}

class ShoppingCart {
    private List<Integer> items = new ArrayList<>();
    private PaymentStrategy paymentStrategy;

    public void addItem(int price) { items.add(price); }
    public void setPaymentStrategy(PaymentStrategy strategy) { this.paymentStrategy = strategy; }

    public void checkout() {
        int total = 0;
        for (int price : items) total += price;
        if (paymentStrategy != null) paymentStrategy.pay(total);
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.addItem(50); cart.addItem(30);
        cart.setPaymentStrategy(new PayPalPayment("user@example.com"));
        cart.checkout(); // "Paid $80 via PayPal"
    }
}`,
    realWorldExample: "A GPS navigation app — you can switch between strategies: shortest route, fastest route, scenic route. Each algorithm is encapsulated separately, and you can switch at runtime without changing the navigation system.",
    whenToUse: [
      "You have many related classes that differ only in behavior",
      "You need different variants of an algorithm",
      "You want to avoid conditionals inside algorithms",
    ],
    pros: ["Open/Closed Principle", "Isolates algorithm implementation", "Can switch at runtime", "Eliminates large conditional statements"],
    cons: ["Clients must be aware of different strategies", "Increases number of classes", "Overkill if only a few algorithms"],
  },
  {
    id: "lld-command",
    name: "Command",
    category: "behavioral",
    intent: "Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
    problem: "You need to issue requests to objects without knowing anything about the operation being requested or the receiver of the request.",
    solution: "Create a command interface with an execute() method. Concrete commands encapsulate a receiver and the actions to perform. An invoker stores commands and can execute them, queue them, or support undo.",
    participants: [
      { id: "Command", name: "Command", type: "interface", methods: ["execute()", "undo()"], fields: [] },
      { id: "ConcreteCommand", name: "ConcreteCommand", type: "class", methods: ["execute()", "undo()"], fields: ["- receiver: Receiver"] },
      { id: "Receiver", name: "Receiver", type: "class", methods: ["action()"], fields: [] },
      { id: "Invoker", name: "Invoker", type: "class", methods: ["setCommand(c)", "executeCommand()"], fields: ["- command: Command"] },
    ],
    structure: [
      { from: "ConcreteCommand", to: "Command", type: "implementation" },
      { from: "ConcreteCommand", to: "Receiver", type: "composition", toLabel: "calls" },
      { from: "Invoker", to: "Command", type: "composition", toLabel: "stores" },
    ],
    codeExample: `import java.util.*;

interface Command {
    void execute();
    void undo();
}

class Light {
    public void on() { System.out.println("Light ON"); }
    public void off() { System.out.println("Light OFF"); }
}

class LightOnCommand implements Command {
    private Light light;
    public LightOnCommand(Light light) { this.light = light; }
    public void execute() { light.on(); }
    public void undo() { light.off(); }
}

class LightOffCommand implements Command {
    private Light light;
    public LightOffCommand(Light light) { this.light = light; }
    public void execute() { light.off(); }
    public void undo() { light.on(); }
}

class RemoteControl {
    private Stack<Command> history = new Stack<>();

    public void submit(Command command) {
        command.execute();
        history.push(command);
    }

    public void undo() {
        if (!history.isEmpty()) {
            history.pop().undo();
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        RemoteControl remote = new RemoteControl();
        Light light = new Light();
        remote.submit(new LightOnCommand(light)); // Light ON
        remote.submit(new LightOffCommand(light)); // Light OFF
        remote.undo(); // Light ON (undoes last command)
    }
}`,
    realWorldExample: "A restaurant — you (Client) give the waiter (Invoker) your order (Command). The waiter writes it down and gives it to the chef (Receiver). The order can be queued, logged, or even canceled (undo).",
    whenToUse: [
      "You need to parameterize objects with operations",
      "You need to queue, schedule, or execute operations remotely",
      "You need undo functionality",
    ],
    pros: ["Single Responsibility Principle", "Open/Closed Principle", "Supports undo/redo", "Supports queuing and logging"],
    cons: ["Increases complexity with many new classes", "Each command is a separate class"],
  },
  {
    id: "lld-state",
    name: "State",
    category: "behavioral",
    intent: "Allow an object to alter its behavior when its internal state changes. The object will appear to change its class.",
    problem: "An object has different behaviors depending on its state, leading to large conditional statements that are hard to maintain.",
    solution: "Create state classes that encapsulate the behavior for each state. The context object delegates behavior to the current state object, and states can transition to other states.",
    participants: [
      { id: "State", name: "State", type: "interface", methods: ["handle(context)"], fields: [] },
      { id: "ConcreteStateA", name: "ConcreteStateA", type: "class", methods: ["handle(context)"], fields: [] },
      { id: "ConcreteStateB", name: "ConcreteStateB", type: "class", methods: ["handle(context)"], fields: [] },
      { id: "Context", name: "Context", type: "class", methods: ["request()", "setState(s)"], fields: ["- state: State"] },
    ],
    structure: [
      { from: "ConcreteStateA", to: "State", type: "implementation" },
      { from: "ConcreteStateB", to: "State", type: "implementation" },
      { from: "Context", to: "State", type: "composition", toLabel: "current" },
    ],
    codeExample: `interface DocumentState {
  publish(document: Document): void;
  edit(document: Document): void;
}

class DraftState implements DocumentState {
  publish(doc: Document): void {
    console.log("Draft → Moderation");
    doc.setState(new ModerationState());
  }
  edit(doc: Document): void {
    console.log("Editing draft...");
  }
}

class ModerationState implements DocumentState {
  publish(doc: Document): void {
    console.log("Moderation → Published");
    doc.setState(new PublishedState());
  }
  edit(doc: Document): void {
    console.log("Cannot edit in moderation");
  }
}

class PublishedState implements DocumentState {
  publish(doc: Document): void {
    console.log("Already published");
  }
  edit(doc: Document): void {
    console.log("Cannot edit after publication");
  }
}

class Document {
  private state: DocumentState = new DraftState();
  setState(state: DocumentState): void { this.state = state; }
  publish(): void { this.state.publish(this); }
  edit(): void { this.state.edit(this); }
}

// Usage
const doc = new Document();
doc.edit();    // "Editing draft..."
doc.publish(); // "Draft → Moderation"
doc.edit();    // "Cannot edit in moderation"
doc.publish(); // "Moderation → Published"`,
    realWorldExample: "A vending machine — it behaves differently based on state: Idle (waiting for money), HasMoney (accepting selection), Dispensing (giving item), OutOfOrder. Each state has different rules for button presses.",
    whenToUse: [
      "Object behavior depends on its state and changes at runtime",
      "You have large conditional statements based on state",
      "State-specific behaviors should be encapsulated together",
    ],
    pros: ["Single Responsibility Principle", "Open/Closed Principle", "Eliminates large conditionals", "Makes state transitions explicit"],
    cons: ["Can be overkill for simple state machines", "Increases number of classes"],
  },
  {
    id: "lld-template-method",
    name: "Template Method",
    category: "behavioral",
    intent: "Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps without changing the algorithm's structure.",
    problem: "You have an algorithm with invariant steps and variant steps. You want to avoid code duplication while allowing subclasses to customize specific parts.",
    solution: "Define a template method in an abstract base class that calls primitive operations (abstract methods) for variant steps. Subclasses override the primitive operations.",
    participants: [
      { id: "AbstractClass", name: "AbstractClass", type: "abstract-class", methods: ["templateMethod()", "primitiveOp1()", "primitiveOp2()"], fields: [] },
      { id: "ConcreteClass", name: "ConcreteClass", type: "class", methods: ["primitiveOp1()", "primitiveOp2()"], fields: [] },
    ],
    structure: [
      { from: "ConcreteClass", to: "AbstractClass", type: "inheritance" },
    ],
    codeExample: `abstract class DataProcessor {
  // Template method - defines the skeleton
  process(): void {
    this.loadData();
    this.processData();
    this.saveData();
    this.logCompletion();
  }

  abstract loadData(): void;
  abstract processData(): void;
  abstract saveData(): void;

  // Common step (hook)
  logCompletion(): void {
    console.log("Processing completed at " + new Date().toISOString());
  }
}

class CSVProcessor extends DataProcessor {
  loadData(): void { console.log("Loading CSV file..."); }
  processData(): void { console.log("Processing CSV rows..."); }
  saveData(): void { console.log("Saving to database..."); }
}

class JSONProcessor extends DataProcessor {
  loadData(): void { console.log("Loading JSON file..."); }
  processData(): void { console.log("Parsing JSON objects..."); }
  saveData(): void { console.log("Saving to API..."); }
}

// Usage
new CSVProcessor().process();
// Loading CSV file...
// Processing CSV rows...
// Saving to database...
// Processing completed at ...`,
    realWorldExample: "A car manufacturing assembly line — the process skeleton is fixed: frame → engine → wheels → painting. But each car model (SUV, Sedan, Truck) can customize the specific steps differently.",
    whenToUse: [
      "You have an algorithm with invariant and variant parts",
      "You want to avoid code duplication across similar algorithms",
      "You want to control which steps subclasses can override",
    ],
    pros: ["Promotes code reuse", "Allows customization", "Inversion of control (Hollywood Principle)"],
    cons: ["Can violate Liskov Substitution Principle", "Harder to understand with many steps", "Limited by the skeleton structure"],
  },
  {
    id: "lld-iterator",
    name: "Iterator",
    category: "behavioral",
    intent: "Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
    problem: "You want to traverse a collection without exposing its internal structure (array, tree, hash map, etc.).",
    solution: "Create an iterator interface with hasNext() and next() methods. Concrete iterators handle the traversal logic for specific collection types.",
    participants: [
      { id: "Iterator", name: "Iterator", type: "interface", methods: ["hasNext(): boolean", "next(): T"], fields: [] },
      { id: "ConcreteIterator", name: "ConcreteIterator", type: "class", methods: ["hasNext()", "next()"], fields: ["- collection: ConcreteCollection", "- index: number"] },
      { id: "Aggregate", name: "Aggregate", type: "interface", methods: ["createIterator(): Iterator"], fields: [] },
      { id: "ConcreteCollection", name: "ConcreteAggregate", type: "class", methods: ["createIterator()"], fields: ["- items: T[]"] },
    ],
    structure: [
      { from: "ConcreteIterator", to: "Iterator", type: "implementation" },
      { from: "ConcreteCollection", to: "Aggregate", type: "implementation" },
      { from: "ConcreteIterator", to: "ConcreteCollection", type: "dependency", toLabel: "traverses" },
    ],
    codeExample: `interface Iterator<T> {
    boolean hasNext();
    T next();
}

class ArrayIterator<T> implements Iterator<T> {
    private int index = 0;
    private T[] collection;
    public ArrayIterator(T[] collection) { this.collection = collection; }
    public boolean hasNext() { return index < collection.length; }
    public T next() { return collection[index++]; }
}

interface Collection<T> {
    Iterator<T> createIterator();
}

class ListCollection<T> implements Collection<T> {
    private T[] items;
    public ListCollection(T[] items) { this.items = items; }
    public Iterator<T> createIterator() { return new ArrayIterator<>(items); }
}

// Usage
public class Main {
    public static void main(String[] args) {
        String[] data = {"A", "B", "C"};
        Collection<String> collection = new ListCollection<>(data);
        Iterator<String> iterator = collection.createIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next()); // A, B, C
        }
    }
}`,
    realWorldExample: "A carousel slide show — you can go next/previous through slides without knowing whether they're stored as an array, linked list, or database records. The remote control (iterator) abstracts traversal.",
    whenToUse: [
      "You want to hide the internal structure of a collection",
      "You want to provide a uniform way to traverse different collections",
      "You want to support multiple traversal methods",
    ],
    pros: ["Single Responsibility Principle", "Open/Closed Principle", "Uniform traversal interface", "Multiple traversals simultaneously"],
    cons: ["Overkill for simple arrays", "May be less efficient than direct access"],
  },
  {
    id: "lld-mediator",
    name: "Mediator",
    category: "behavioral",
    intent: "Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly.",
    problem: "A set of objects communicate in complex ways, creating a web of dependencies that's hard to maintain and extend.",
    solution: "Create a mediator object that centralizes communication between components. Components only know about the mediator, not each other.",
    participants: [
      { id: "Mediator", name: "Mediator", type: "interface", methods: ["notify(sender, event)"], fields: [] },
      { id: "ConcreteMediator", name: "ConcreteMediator", type: "class", methods: ["notify(sender, event)"], fields: ["- components: Component[]"] },
      { id: "Component", name: "Component", type: "abstract-class", methods: [], fields: ["- mediator: Mediator"] },
      { id: "ConcreteComponent", name: "ConcreteComponent", type: "class", methods: ["doA()", "doB()"], fields: [] },
    ],
    structure: [
      { from: "ConcreteMediator", to: "Mediator", type: "implementation" },
      { from: "ConcreteComponent", to: "Component", type: "inheritance" },
      { from: "Component", to: "Mediator", type: "dependency", toLabel: "notifies" },
    ],
    codeExample: `interface Mediator {
    void notify(Component sender, String event);
}

abstract class Component {
    protected Mediator mediator;
    public Component(Mediator mediator) { this.mediator = mediator; }
}

class Button extends Component {
    public Button(Mediator mediator) { super(mediator); }
    public void click() {
        System.out.println("Button clicked");
        mediator.notify(this, "click");
    }
}

class TextBox extends Component {
    public TextBox(Mediator mediator) { super(mediator); }
    public void input() {
        System.out.println("Text changed");
    }
}

class AuthenticationDialog implements Mediator {
    private TextBox title;
    private Button loginBtn;
    private Button registerBtn;

    public AuthenticationDialog() {
        this.title = new TextBox(this);
        this.loginBtn = new Button(this);
        this.registerBtn = new Button(this);
    }

    public void notify(Component sender, String event) {
        if (sender == loginBtn && event.equals("click")) {
            System.out.println("Show login form");
        }
        if (sender == registerBtn && event.equals("click")) {
            System.out.println("Show registration form");
        }
    }
}

// Usage
public class Main {
    public static void main(String[] args) {
        AuthenticationDialog dialog = new AuthenticationDialog();
        // Components communicate only through the mediator
    }
}`,
    realWorldExample: "An air traffic control tower (Mediator) at an airport — planes (Components) don't talk to each other directly. They communicate through the tower, which coordinates landing/takeoff schedules, preventing collisions.",
    whenToUse: [
      "Many objects communicate in complex, hard-to-maintain ways",
      "You want to reduce coupling between components",
      "You want to centralize control logic",
    ],
    pros: ["Reduces coupling between components", "Centralizes communication logic", "Makes component interaction easier to understand"],
    cons: ["Mediator can become a god object", "Adds complexity", "Can become a bottleneck"],
  },
  {
    id: "lld-chain-of-responsibility",
    name: "Chain of Responsibility",
    category: "behavioral",
    intent: "Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.",
    problem: "You have multiple handlers that could process a request, but you don't know which one should handle it until runtime.",
    solution: "Create an abstract handler with a method to set the next handler. Each concrete handler either handles the request or passes it to the next handler in the chain.",
    participants: [
      { id: "Handler", name: "Handler", type: "interface", methods: ["setNext(h)", "handle(request)"], fields: [] },
      { id: "BaseHandler", name: "BaseHandler", type: "abstract-class", methods: ["setNext(h)", "handle(request)"], fields: ["- next: Handler"] },
      { id: "ConcreteHandlerA", name: "ConcreteHandlerA", type: "class", methods: ["handle(request)"], fields: [] },
      { id: "ConcreteHandlerB", name: "ConcreteHandlerB", type: "class", methods: ["handle(request)"], fields: [] },
    ],
    structure: [
      { from: "BaseHandler", to: "Handler", type: "implementation" },
      { from: "ConcreteHandlerA", to: "BaseHandler", type: "inheritance" },
      { from: "ConcreteHandlerB", to: "BaseHandler", type: "inheritance" },
      { from: "BaseHandler", to: "Handler", type: "dependency", toLabel: "next" },
    ],
    codeExample: `abstract class Handler {
    private Handler next;

    public Handler setNext(Handler handler) {
        this.next = handler;
        return handler;
    }

    public void handle(String request) {
        if (next != null) next.handle(request);
    }

    protected Handler getNext() { return next; }
}

class BasicSupport extends Handler {
    public void handle(String request) {
        if (request.equals("password reset")) {
            System.out.println("Basic Support: Handled password reset");
        } else {
            System.out.println("Basic Support: Passing to supervisor...");
            super.handle(request);
        }
    }
}

class Supervisor extends Handler {
    public void handle(String request) {
        if (request.equals("refund")) {
            System.out.println("Supervisor: Handled refund request");
        } else {
            System.out.println("Supervisor: Passing to manager...");
            super.handle(request);
        }
    }
}

class Manager extends Handler {
    public void handle(String request) {
        if (request.equals("complaint")) {
            System.out.println("Manager: Handled complaint");
        } else {
            System.out.println("Manager: Cannot handle " + request);
        }
    }
}

// Usage: Chain Basic → Supervisor → Manager
public class Main {
    public static void main(String[] args) {
        Handler basic = new BasicSupport();
        basic.setNext(new Supervisor()).setNext(new Manager());
        basic.handle("refund");
        // "Basic Support: Passing to supervisor..." → "Supervisor: Handled refund request"
    }
}`,
    realWorldExample: "A customer support ticket system — a simple request (password reset) is handled by Level-1 support. If it's complex, it escalates to Level-2, then Level-3, and so on. Each level decides if they can handle it or pass it up.",
    whenToUse: [
      "More than one handler can process a request",
      "The handler should be determined at runtime",
      "You want to decouple sender and receiver",
    ],
    pros: ["Reduces coupling", "Open/Closed Principle", "Flexible handler assignment", "Single Responsibility Principle"],
    cons: ["No guarantee the request will be handled", "Can be hard to debug", "May create long chains"],
  },
];

// ──────────────────────────────────────────────
// HLD — SYSTEM ARCHITECTURE PROBLEMS
// ──────────────────────────────────────────────

export const HLD_PROBLEMS: SystemDesignProblem[] = [
  {
    id: "hld-url-shortener",
    title: "URL Shortener (like TinyURL)",
    category: "hld",
    description: "Design a service that takes long URLs and creates short, unique aliases. When users access a short URL, they are redirected to the original long URL.",
    requirements: [
      "Generate short unique keys for long URLs",
      "Handle millions of URL creations per day",
      "Redirect short URLs to original URLs with low latency",
      "Support custom aliases",
      "Track analytics (click count, location, etc.)",
      "High availability and durability",
    ],
    estimatedScale: "100M URLs/month, 1000 reads/sec peak",
    components: [
      { id: "client", name: "Client (Browser/App)", type: "client", description: "Users creating or accessing short URLs" },
      { id: "dns", name: "DNS", type: "dns", description: "Resolves short domain to load balancer IP" },
      { id: "cdn", name: "CDN", type: "cdn", description: "Caches frequently accessed redirects" },
      { id: "lb", name: "Load Balancer", type: "load-balancer", description: "Distributes traffic across app servers" },
      { id: "api-gateway", name: "API Gateway", type: "api-gateway", description: "Routes requests, handles auth & rate limiting" },
      { id: "web-server", name: "Web Servers", type: "web-server", description: "Stateless app servers handling create/redirect" },
      { id: "cache", name: "Redis Cache", type: "cache", description: "Caches URL mappings for fast redirects (LRU)" },
      { id: "database", name: "Database (Cassandra)", type: "database", description: "Stores URL mappings (key→longURL, user, metadata)" },
      { id: "worker", name: "Analytics Worker", type: "worker", description: "Processes click logs, generates analytics async" },
      { id: "message-queue", name: "Message Queue (Kafka)", type: "message-queue", description: "Buffers click events for async processing" },
    ],
    connections: [
      { from: "client", to: "dns", label: "DNS query", protocol: "DNS" },
      { from: "client", to: "cdn", label: "HTTP request", protocol: "HTTPS" },
      { from: "cdn", to: "lb", label: "Cache miss → forward", protocol: "HTTP" },
      { from: "lb", to: "api-gateway", label: "Traffic distribution", protocol: "HTTPS" },
      { from: "api-gateway", to: "web-server", label: "Route request", protocol: "HTTP" },
      { from: "web-server", to: "cache", label: "Get mapping (read)", protocol: "Redis" },
      { from: "web-server", to: "database", label: "Store/retrieve URL", protocol: "Cassandra Query" },
      { from: "web-server", to: "message-queue", label: "Publish click event", protocol: "Kafka" },
      { from: "message-queue", to: "worker", label: "Consume events", protocol: "Kafka" },
    ],
    deepDive: `## URL Shortener Deep Dive

### Key Design Decisions

1. **Key Generation**: Use Base62 encoding (a-z, A-Z, 0-9 = 62 chars). A 7-character key gives 62^7 ≈ 3.5 trillion combinations.
2. **ID Generation**: Use a distributed unique ID generator (Snowflake) or database sequences. Convert ID to Base62 for the short key.
3. **Caching**: Cache hot URLs in Redis with LRU eviction. Use a write-through cache strategy.
4. **Database**: Cassandra for scalability and availability. Partition by key for fast lookups.
5. **Redirection**: Return HTTP 301 (permanent) for SEO or 302 (temporary) for analytics.

### Scale Estimations
- 100M URLs/month → ~40 URLs/sec creation
- Read-to-write ratio: ~100:1 (most traffic is reads)
- Storage: 100M URLs × 500 bytes ≈ 50 GB/year
- Cache: 80% of requests hit 20% of URLs → cache 20% most popular`,
    followUp: [
      "How would you handle custom URLs?",
      "How would you detect and prevent abuse?",
      "How would you support URL expiration?",
      "How would you handle database migrations?",
    ],
  },
  {
    id: "hld-chat-system",
    title: "Real-time Chat System (like WhatsApp)",
    category: "hld",
    description: "Design a real-time messaging system that supports one-on-one chat, group chat, online/offline status, media sharing, and end-to-end encryption.",
    requirements: [
      "Real-time message delivery with low latency",
      "Support one-on-one and group chats",
      "Online/offline presence indication",
      "Media sharing (images, videos, files)",
      "Message sync across multiple devices",
      "Push notifications for offline users",
      "End-to-end encryption",
    ],
    estimatedScale: "1B messages/day, 500M active users",
    components: [
      { id: "client", name: "Mobile/Web Client", type: "client", description: "User devices with persistent WebSocket connections" },
      { id: "lb", name: "Load Balancer", type: "load-balancer", description: "WebSocket load balancing with sticky sessions" },
      { id: "web-server", name: "Chat Servers", type: "web-server", description: "Handles WebSocket connections, message routing" },
      { id: "cache", name: "Redis Session Store", type: "cache", description: "Tracks active connections, user presence" },
      { id: "message-queue", name: "Message Queue (Kafka)", type: "message-queue", description: "Buffers messages for async delivery" },
      { id: "database", name: "Message DB (Cassandra)", type: "database", description: "Stores message history, time-ordered" },
      { id: "worker", name: "Notification Workers", type: "worker", description: "Sends push notifications to offline users via FCM/APNs" },
      { id: "object-storage", name: "Media Storage (S3)", type: "object-storage", description: "Stores shared images, videos, files" },
      { id: "search-service", name: "Search Index", type: "search-service", description: "Indexes messages for search functionality" },
    ],
    connections: [
      { from: "client", to: "lb", label: "WebSocket connection", protocol: "WSS" },
      { from: "lb", to: "web-server", label: "Sticky session route", protocol: "WSS" },
      { from: "web-server", to: "cache", label: "Read/write presence", protocol: "Redis" },
      { from: "web-server", to: "message-queue", label: "Publish message event", protocol: "Kafka" },
      { from: "message-queue", to: "database", label: "Persist messages", protocol: "Cassandra batch" },
      { from: "message-queue", to: "worker", label: "Trigger notification", protocol: "Kafka" },
      { from: "worker", to: "client", label: "Push notification", protocol: "FCM/APNs" },
      { from: "web-server", to: "object-storage", label: "Upload/download media", protocol: "HTTPS" },
    ],
    deepDive: `## Chat System Deep Dive

### Key Design Decisions

1. **WebSockets**: Persistent bidirectional connections for real-time messaging. Use sticky sessions at the load balancer.
2. **Message Model**: Each message has a globally unique ID (Snowflake), sender, recipient(s), content, timestamp, and type (text/media).
3. **Group Chats**: Two approaches:
   - *Fan-out on write*: Store message once, recipients pull on read (better for small groups)
   - *Fan-out on read*: Store message per recipient (better for large groups, used by WhatsApp)
4. **Presence**: Heartbeat mechanism via WebSocket. If no heartbeat for 30s, mark as offline.
5. **Multi-device Sync**: Use a sync cursor (last message ID seen) per device. On reconnect, pull all messages after cursor.
6. **End-to-End Encryption**: Use Signal Protocol (Double Ratchet) — each chat has per-message keys.

### Key Estimates
- 1B messages/day → ~11,500 messages/sec
- Storage: 1B × 1KB = 1TB/day
- A single chat server can handle ~1M concurrent WebSocket connections`,
    followUp: [
      "How would you implement end-to-end encryption?",
      "How would you handle offline message delivery?",
      "How does WhatsApp achieve 99.99% availability?",
      "How would you support disappearing messages?",
    ],
  },
  {
    id: "hld-video-streaming",
    title: "Video Streaming Platform (like Netflix)",
    category: "hld",
    description: "Design a video streaming platform that supports uploading, transcoding, storing, and streaming video content to millions of users across devices.",
    requirements: [
      "Upload and process video files of various formats",
      "Transcode videos to multiple resolutions (360p, 720p, 1080p, 4K)",
      "Stream video with adaptive bitrate (ABR) based on network",
      "Support millions of concurrent viewers",
      "Recommend content based on user preferences",
      "Global delivery with low latency",
    ],
    estimatedScale: "200M subscribers, 1B hours watched/month",
    components: [
      { id: "client", name: "Streaming Client", type: "client", description: "Web/mobile/TV apps playing video content" },
      { id: "dns", name: "DNS (Route53)", type: "dns", description: "Geo-routing to nearest CDN edge" },
      { id: "cdn", name: "CDN (CloudFront)", type: "cdn", description: "Edge caches video chunks globally (85%+ cache hit)" },
      { id: "lb", name: "Load Balancer", type: "load-balancer", description: "Distributes API traffic" },
      { id: "api-gateway", name: "API Gateway", type: "api-gateway", description: "REST API for catalog, recommendations" },
      { id: "web-server", name: "App Servers", type: "web-server", description: "Serves APIs, handles auth and user management" },
      { id: "cache", name: "Metadata Cache (Redis)", type: "cache", description: "Caches video metadata, user preferences" },
      { id: "database", name: "User/Content DB", type: "database", description: "PostgreSQL for user data, content catalog" },
      { id: "microservice", name: "Transcoding Pipeline", type: "microservice", description: "Converts videos to multiple formats/resolutions" },
      { id: "object-storage", name: "Video Storage (S3)", type: "object-storage", description: "Stores raw and transcoded video files" },
      { id: "message-queue", name: "Job Queue (SQS)", type: "message-queue", description: "Queues transcoding jobs" },
      { id: "worker", name: "Analytics Engine", type: "worker", description: "Processes viewing patterns for recommendations" },
      { id: "search-service", name: "Search Service", type: "search-service", description: "Full-text search across video catalog" },
    ],
    connections: [
      { from: "client", to: "dns", label: "DNS lookup", protocol: "DNS" },
      { from: "client", to: "cdn", label: "Stream video chunks", protocol: "HLS/DASH" },
      { from: "client", to: "lb", label: "API calls", protocol: "HTTPS" },
      { from: "cdn", to: "object-storage", label: "Cache miss → origin fetch", protocol: "HTTPS" },
      { from: "web-server", to: "cache", label: "Read/write cache", protocol: "Redis" },
      { from: "web-server", to: "database", label: "User/content queries", protocol: "SQL" },
      { from: "object-storage", to: "message-queue", label: "New upload event", protocol: "SQS" },
      { from: "message-queue", to: "microservice", label: "Transcode job", protocol: "SQS" },
      { from: "microservice", to: "object-storage", label: "Store transcoded output", protocol: "HTTPS" },
      { from: "message-queue", to: "worker", label: "View event", protocol: "Kafka" },
    ],
    deepDive: `## Video Streaming Deep Dive

### Key Design Decisions

1. **Adaptive Bitrate Streaming (ABR)**: Encode videos in multiple bitrates (e.g., 500kbps, 1Mbps, 2Mbps, 5Mbps). Client fetches the optimal bitrate based on network conditions.
2. **Protocol**: Use HLS (HTTP Live Streaming) or DASH — both break video into small chunks (2-10 seconds). No persistent connection needed.
3. **CDN**: Global CDN with edge servers caching popular content. Regional caches for medium-popular content. Origin servers for everything else.
4. **Transcoding Pipeline**: Async job queue. On upload, publisher stores raw video → triggers transcode job → splits into chunks at each resolution.
5. **Recommendation Engine**: Batch processing of viewing history using collaborative filtering + content-based filtering.

### Scale Numbers
- 200M subscribers, 15,000 titles
- Peak: 10M+ concurrent streams
- CDN handles 85%+ of traffic (popular content)
- Storage: ~50GB/hour for 4K content per title`,
    followUp: [
      "How would you implement personalized recommendations?",
      "How would you handle live streaming?",
      "What's the trade-off between HLS and MPEG-DASH?",
      "How would you reduce CDN costs?",
    ],
  },
  {
    id: "hld-ride-hailing",
    title: "Ride Hailing Service (like Uber)",
    category: "hld",
    description: "Design a ride-hailing platform connecting riders with drivers in real-time, handling ride requests, driver matching, pricing, and payments.",
    requirements: [
      "Real-time rider-driver matching based on location",
      "GPS tracking and ETA calculation",
      "Dynamic pricing (surge pricing) based on demand",
      "Trip history and fare calculation",
      "Payment processing (cards, wallets, cash)",
      "Rating and review system",
      "Handle millions of concurrent requests",
    ],
    estimatedScale: "15M trips/day, 5M active drivers, 100M riders",
    components: [
      { id: "client", name: "Rider App / Driver App", type: "client", description: "Mobile apps with GPS tracking" },
      { id: "lb", name: "Load Balancer", type: "load-balancer", description: "Geo-based traffic distribution" },
      { id: "api-gateway", name: "API Gateway", type: "api-gateway", description: "Routes requests, handles auth" },
      { id: "web-server", name: "Ride Service", type: "web-server", description: "Core ride logic, state management" },
      { id: "cache", name: "Redis GeoSpatial", type: "cache", description: "Stores driver locations using geohash indices" },
      { id: "database", name: "Trip DB (PostgreSQL)", type: "database", description: "Trip history, user profiles, payments" },
      { id: "microservice", name: "Matching Service", type: "microservice", description: "Geospatial matching: finds nearest available drivers" },
      { id: "microservice", name: "Pricing Engine", type: "microservice", description: "Computes fare: base + distance + time + surge multiplier" },
      { id: "microservice", name: "Payment Service", type: "microservice", description: "Processes payments, manages wallets" },
      { id: "message-queue", name: "Event Bus (Kafka)", type: "message-queue", description: "Real-time event streaming (location updates, ride events)" },
      { id: "worker", name: "ETA Calculator", type: "worker", description: "Computes ETAs using map data and traffic conditions" },
      { id: "search-service", name: "Maps & Routing", type: "search-service", description: "Map data, route optimization, traffic data" },
    ],
    connections: [
      { from: "client", to: "lb", label: "API + WebSocket", protocol: "HTTPS/WSS" },
      { from: "lb", to: "api-gateway", label: "Route traffic", protocol: "HTTPS" },
      { from: "api-gateway", to: "web-server", label: "Ride requests", protocol: "gRPC" },
      { from: "web-server", to: "cache", label: "Update/read driver location", protocol: "Redis Geo" },
      { from: "web-server", to: "microservice", label: "Invoke matching", protocol: "gRPC" },
      { from: "microservice", to: "cache", label: "Query nearby drivers", protocol: "Redis Geo" },
      { from: "web-server", to: "message-queue", label: "Publish ride events", protocol: "Kafka" },
      { from: "message-queue", to: "worker", label: "Compute ETAs", protocol: "Kafka" },
      { from: "worker", to: "search-service", label: "Route + traffic data", protocol: "gRPC" },
      { from: "web-server", to: "database", label: "Persist trip data", protocol: "SQL" },
    ],
    deepDive: `## Ride Hailing Deep Dive

### Key Design Decisions

1. **Geospatial Indexing**: Use Geohash (or Uber's H3 hexagon system) to index driver locations. Divides the world into hierarchical grids. Query nearby drivers by geohash prefix.
2. **Driver Matching**: When a rider requests a ride:
   - Find the rider's geohash cell + neighboring cells
   - Query Redis for available drivers in those cells
   - Filter by driver rating, car type, proximity
   - Send ride request to top 3-5 drivers via WebSocket
   - First driver to accept gets the ride
3. **Surge Pricing**: Monitor supply (available drivers) vs demand (pending requests) per geohash zone. If demand > supply × threshold, apply surge multiplier.
4. **State Machine**: Each ride goes through: REQUESTING → ACCEPTED → ARRIVED → IN_PROGRESS → COMPLETED → PAID. Track state in the ride service.
5. **Real-time Updates**: Use WebSockets for driver location streaming and ride status updates.

### Scale Numbers
- 15M trips/day: ~175 trips/sec average, ~500 peak
- Each driver sends location every 3 seconds: ~1.6M writes/sec
- Redis handles 1.6M writes/sec with clustering (shard by region)`,
    followUp: [
      "How would you prevent fraud (fake rides, fake drivers)?",
      "How would you handle the 'wild goose chase' problem?",
      "How would Uber Pool / carpooling work?",
      "How would you design the rating system?",
    ],
  },
  {
    id: "hld-social-feed",
    title: "Social Media Feed (like Twitter)",
    category: "hld",
    description: "Design a social media platform where users post tweets, follow other users, and see a personalized timeline of tweets from people they follow.",
    requirements: [
      "User can post tweets (text, images, videos)",
      "User can follow/unfollow other users",
      "Timeline shows tweets from followed users in reverse chronological order",
      "Support for likes, retweets, comments",
      "Trending topics and hashtags",
      "Handle celebrity users with millions of followers",
    ],
    estimatedScale: "500M tweets/day, 300M active users, celebrities with 100M+ followers",
    components: [
      { id: "client", name: "Web/Mobile Client", type: "client", description: "User devices" },
      { id: "lb", name: "Load Balancer", type: "load-balancer", description: "Distributes API traffic" },
      { id: "api-gateway", name: "API Gateway", type: "api-gateway", description: "Routes requests, rate limiting" },
      { id: "web-server", name: "Tweet Service", type: "web-server", description: "Handles posting, deleting tweets" },
      { id: "web-server", name: "Timeline Service", type: "web-server", description: "Generates and serves user timelines" },
      { id: "cache", name: "Redis Cache", type: "cache", description: "Caches timelines, hot tweets, user metadata" },
      { id: "database", name: "Tweet DB (Cassandra)", type: "database", description: "Stores tweets partitioned by user_id" },
      { id: "database", name: "User Graph DB", type: "database", description: "Follow relationships (Neo4j or MySQL)" },
      { id: "message-queue", name: "Fanout Queue (Kafka)", type: "message-queue", description: "Fanout tweets to followers" },
      { id: "worker", name: "Fanout Service", type: "worker", description: "Writes tweet to followers' timelines" },
      { id: "search-service", name: "Search Service", type: "search-service", description: "Full-text search, hashtag indexing" },
      { id: "object-storage", name: "Media Storage", type: "object-storage", description: "Stores images and videos" },
    ],
    connections: [
      { from: "client", to: "lb", label: "HTTP requests", protocol: "HTTPS" },
      { from: "lb", to: "api-gateway", label: "Route traffic", protocol: "HTTPS" },
      { from: "api-gateway", to: "web-server", label: "Tweet CRUD", protocol: "gRPC" },
      { from: "web-server", to: "message-queue", label: "New tweet event", protocol: "Kafka" },
      { from: "message-queue", to: "worker", label: "Fanout task", protocol: "Kafka" },
      { from: "worker", to: "cache", label: "Write to follower timelines", protocol: "Redis" },
      { from: "worker", to: "database", label: "Persist tweet", protocol: "Cassandra" },
      { from: "api-gateway", to: "web-server", label: "Timeline request", protocol: "gRPC" },
      { from: "web-server", to: "cache", label: "Get timeline", protocol: "Redis" },
      { from: "web-server", to: "database", label: "Fetch older tweets", protocol: "Cassandra" },
    ],
    deepDive: `## Social Feed Deep Dive

### Key Design Decisions

1. **Fanout Approaches**:
   - *Fanout on Write (Push)*: When a user tweets, the tweet is inserted into all followers' timelines (pre-computed). Used for most users.
   - *Fanout on Read (Pull)*: For celebrities with millions of followers, don't fanout. When a follower requests timeline, fetch celebrity tweets separately and merge. This avoids the "thundering herd" problem.
   - **Hybrid Approach**: Fanout on write for users with <10K followers. Fanout on read for celebrities.

2. **Timeline Generation**:
   - Each user has a timeline list in Redis (most recent 800 tweets)
   - When viewing timeline: read from Redis (fast) + merge with any celebrity tweets
   - Paginate with cursor-based pagination (not offset-based)

3. **Tweet Storage**: Partition by user_id in Cassandra. Each tweet has a globally unique ID (Snowflake, time-sortable). Primary key: (user_id, tweet_id).

4. **Trending Topics**: Use a sliding window counter (e.g., tweets with hashtag in last hour). Use a stream processing engine (Flink/Kafka Streams) to count hashtag frequency per time window.

### Scale Numbers
- 500M tweets/day: ~5,800 writes/sec
- Average user follows ~200 people
- Fanout for average user: write to 200 timelines = 1.16M timeline writes/sec
- Celebrities (100M+ followers): pull-based to avoid 100M writes per tweet`,
    followUp: [
      "How would you implement the 'For You' algorithmic feed?",
      "How would you handle tweet deletion across timelines?",
      "How would you implement blocking/muting?",
      "How would the system handle viral tweets?",
    ],
  },
];

// ──────────────────────────────────────────────
// COMBINED EXPORT
// ──────────────────────────────────────────────

export const SYSTEM_DESIGN_PROBLEMS: (DesignPattern | SystemDesignProblem)[] = [
  ...DESIGN_PATTERNS,
  ...HLD_PROBLEMS,
];

export function isDesignPattern(item: DesignPattern | SystemDesignProblem): item is DesignPattern {
  return 'category' in item && (item.category === 'creational' || item.category === 'structural' || item.category === 'behavioral');
}

export function getDesignPatternsByCategory(category: DesignPattern['category']): DesignPattern[] {
  return DESIGN_PATTERNS.filter(p => p.category === category);
}
